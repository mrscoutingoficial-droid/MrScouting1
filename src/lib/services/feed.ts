import { createClient } from '@/lib/supabase/client';

export interface FeedPost {
    id: string;
    created_at: string;
    title: string;
    content: string;
    category: string;
    is_exclusive: boolean;
    author_id: string;
    profiles?: {
        full_name: string;
        avatar_url: string;
        username: string;
    };
    player_metadata?: {
        player_name: string;
        age: number;
        position: string;
        current_team: string;
        radar_data: any;
    };
}

export const getFeedPosts = async (categoryFilter?: string) => {
    const supabase = createClient();

    let query = supabase
        .from('posts')
        .select(`
            *,
            profiles:author_id (
                full_name,
                avatar_url
            )
        `)
        .order('created_at', { ascending: false });

    if (categoryFilter && categoryFilter !== 'Todo') {
        // Map Spanish UI tabs to database categories if needed, 
        // but for now we assume they match or are handled in the UI.
        const catMap: Record<string, string> = {
            'Artículos': 'articulo',
            'Tácticas': 'analisis_tactico',
            'Jugadores': 'analisis_jugador',
        };
        const dbCat = catMap[categoryFilter] || categoryFilter;
        query = query.eq('category', dbCat);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching feed posts:', error);
        return [];
    }

    return data as any[];
};

export const getPostById = async (id: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles:author_id (
                full_name,
                avatar_url
            ),
            player_metadata (
                *
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching post detail:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
        });
        return null;
    }

    return data as any;
};
export const getUserPosts = async (userId: string, filter?: 'Todos' | 'Borradores' | 'Publicados' | 'Exclusivos') => {
    const supabase = createClient();

    let query = supabase
        .from('posts')
        .select(`
            *,
            profiles:author_id (
                full_name,
                avatar_url
            )
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

    if (filter === 'Exclusivos') {
        query = query.eq('is_exclusive', true);
    }

    // Note: 'Borradores' and 'Publicados' would require a status column.
    // For now, we return all posts for 'Todos' and 'Publicados'.

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching user posts:', error);
        return [];
    }

    return data as any[];
};
export const getComments = async (postId: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('comments')
        .select(`
            *,
            profiles:author_id (
                full_name,
                avatar_url
            )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching comments:', error);
        return [];
    }

    return data as any[];
};

export const createComment = async (postId: string, authorId: string, content: string) => {
    const supabase = createClient();
    console.log(`[createComment] Starting for post ${postId}, author ${authorId}`);

    // Ensure profile exists (fallback for missing trigger execution/data)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authorId)
        .single();

    console.log(`[createComment] Profile check result:`, { profile, profileError });

    if (!profile) {
        console.log(`[createComment] Profile missing, attempting upsert...`);
        const { data: { user } } = await supabase.auth.getUser();
        const fallbackName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Anonymous Analyst';

        const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
                id: authorId,
                full_name: fallbackName
            });

        if (upsertError) {
            console.error(`[createComment] Profile upsert failed:`, upsertError);
        } else {
            console.log(`[createComment] Profile upsert successful for ${fallbackName}`);
        }
    }

    console.log(`[createComment] Proceeding to insert comment...`);
    const { data, error } = await supabase
        .from('comments')
        .insert({
            post_id: postId,
            author_id: authorId,
            content
        })
        .select(`
            *,
            profiles:author_id (
                full_name,
                avatar_url
            )
        `)
        .single();

    if (error) {
        console.error('[createComment] Comment insert failed:', error);
        throw error;
    }

    console.log(`[createComment] Comment successfully created:`, data.id);
    return data as any;
};

// --- Social Interactions ---

export const getPostInteractions = async (postId: string, userId: string) => {
    const supabase = createClient();

    const [likesResult, bookmarksResult, totalLikesResult] = await Promise.all([
        supabase.from('post_likes').select('user_id').eq('post_id', postId).eq('user_id', userId).single(),
        supabase.from('post_bookmarks').select('user_id').eq('post_id', postId).eq('user_id', userId).single(),
        supabase.from('post_likes').select('user_id', { count: 'exact' }).eq('post_id', postId)
    ]);

    return {
        isLiked: !likesResult.error,
        isBookmarked: !bookmarksResult.error,
        totalLikes: totalLikesResult.count || 0
    };
};

export const toggleLike = async (postId: string, userId: string, isCurrentlyLiked: boolean) => {
    const supabase = createClient();

    if (isCurrentlyLiked) {
        const { error } = await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId);
        if (error) throw error;
        return false;
    } else {
        const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: userId });
        if (error) throw error;
        return true;
    }
};

export const toggleBookmark = async (postId: string, userId: string, isCurrentlyBookmarked: boolean) => {
    const supabase = createClient();

    if (isCurrentlyBookmarked) {
        const { error } = await supabase.from('post_bookmarks').delete().eq('post_id', postId).eq('user_id', userId);
        if (error) throw error;
        return false;
    } else {
        const { error } = await supabase.from('post_bookmarks').insert({ post_id: postId, user_id: userId });
        if (error) throw error;
        return true;
    }
};
