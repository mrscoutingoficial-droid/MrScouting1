import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'MR. SCOUTING'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0a0f1e',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background glow effect */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '800px',
                        height: '800px',
                        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, rgba(10, 15, 30, 0) 70%)',
                        zIndex: 0,
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                    }}
                >
                    <div
                        style={{
                            fontSize: 100,
                            fontWeight: 900,
                            color: 'white',
                            letterSpacing: '-0.05em',
                            display: 'flex',
                            alignItems: 'center',
                            lineHeight: 1,
                        }}
                    >
                        MR.
                        <span style={{ color: '#3b82f6', marginLeft: '20px' }}>SCOUTING</span>
                    </div>

                    <div
                        style={{
                            fontSize: 32,
                            fontWeight: 600,
                            color: '#94a3b8',
                            marginTop: 40,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Plataforma Élite de Análisis Táctico
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            gap: '20px',
                            marginTop: 80,
                        }}
                    >
                        <div style={{ padding: '10px 30px', background: '#252b46', color: '#bef264', borderRadius: '100px', fontSize: 24, fontWeight: 'bold' }}>
                            Scouting
                        </div>
                        <div style={{ padding: '10px 30px', background: '#252b46', color: '#bef264', borderRadius: '100px', fontSize: 24, fontWeight: 'bold' }}>
                            Laboratorio Táctico
                        </div>
                        <div style={{ padding: '10px 30px', background: '#252b46', color: '#bef264', borderRadius: '100px', fontSize: 24, fontWeight: 'bold' }}>
                            Reportes Pro
                        </div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
