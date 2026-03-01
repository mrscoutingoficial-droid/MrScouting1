'use client';

import { useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const MAIN_TABS = [
    '/dashboard',           // Inicio
    '/dashboard/scouting',  // Scouting
    '/dashboard/reports',   // Informes
    '/dashboard/profile'    // Perfil
];

export function MobileSwipeWrapper({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Reset position instantly when pathname changes (route change completed)
    // and prefetch adjacent routes for instant transitions
    useEffect(() => {
        setDragX(0);
        setIsDragging(false);
        setIsAnimating(false);

        const currentIndex = MAIN_TABS.indexOf(pathname);
        if (currentIndex !== -1) {
            // Background prefetch adjacent tabs so swiping feels instantaneous
            if (currentIndex > 0) {
                router.prefetch(MAIN_TABS[currentIndex - 1]);
            }
            if (currentIndex < MAIN_TABS.length - 1) {
                router.prefetch(MAIN_TABS[currentIndex + 1]);
            }
        }
    }, [pathname, router]);

    const onTouchStart = (e: React.TouchEvent) => {
        // Only trigger on main tabs, ignore if animating or not on a main tab
        if (isAnimating || MAIN_TABS.indexOf(pathname) === -1) return;

        setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
        setIsDragging(true);
        setDragX(0);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (!touchStart || !isDragging || isAnimating) return;

        const currentX = e.targetTouches[0].clientX;
        const currentY = e.targetTouches[0].clientY;

        const deltaX = currentX - touchStart.x;
        const deltaY = currentY - touchStart.y;

        // If the user's intent is clearly to scroll vertically, cancel horizontal drag tracking
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(dragX) < 10) {
            setIsDragging(false);
            setDragX(0);
            return;
        }

        const currentIndex = MAIN_TABS.indexOf(pathname);
        if (currentIndex === -1) return;

        // Add resistance/rubber-band effect at the boundaries
        let newDragX = deltaX;
        if ((currentIndex === 0 && newDragX > 0) || (currentIndex === MAIN_TABS.length - 1 && newDragX < 0)) {
            newDragX = newDragX * 0.25; // 75% resistance simulating rubber band
        }

        setDragX(newDragX);
    };

    const onTouchEndHandler = () => {
        if (!touchStart || !isDragging || isAnimating) return;
        setIsDragging(false);

        const currentIndex = MAIN_TABS.indexOf(pathname);
        if (currentIndex === -1) {
            setDragX(0);
            return;
        }

        // The swipe must be at least 25% of the screen width to trigger navigation
        const threshold = window.innerWidth * 0.25;

        if (dragX < -threshold && currentIndex < MAIN_TABS.length - 1) {
            // Swiped Left firm enough -> Navigate to Next Tab
            setIsAnimating(true);
            setDragX(-window.innerWidth); // Animate out view physically
            router.push(MAIN_TABS[currentIndex + 1]);
        } else if (dragX > threshold && currentIndex > 0) {
            // Swiped Right firm enough -> Navigate to Prev Tab
            setIsAnimating(true);
            setDragX(window.innerWidth); // Animate out view physically
            router.push(MAIN_TABS[currentIndex - 1]);
        } else {
            // Threshold not met -> Cancel and Snap back to original position
            setIsAnimating(true);
            setDragX(0);
            // Allow animations to naturally finish before re-enabling drags
            setTimeout(() => setIsAnimating(false), 300);
        }

        setTouchStart(null);
    };

    return (
        <div
            className="flex-1 relative w-full h-full overflow-hidden"
            style={{ touchAction: 'pan-y' }} // Instructs browsers to not interfere with horizontal touches
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndHandler}
            onTouchCancel={onTouchEndHandler}
        >
            <div
                className="w-full h-full"
                style={{
                    transform: `translateX(${dragX}px)`,
                    // 'none' allows instant 1:1 follow to finger. 'ease-out' snaps view when finger releases.
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
            >
                {children}
            </div>
        </div>
    );
}
