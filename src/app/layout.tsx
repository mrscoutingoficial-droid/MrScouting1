import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://stitch-mr-scouting-landing-page.vercel.app'),
  title: {
    template: 'MR. SCOUTING | %s',
    default: 'MR. SCOUTING | Plataforma Élite de Análisis Táctico',
  },
  description: "La plataforma definitiva para analistas y scouts de fútbol. Normalización de datos, análisis predictivo, y laboratorio táctico inteligente.",
  keywords: ['scouting fútbol', 'análisis táctico', 'software entrenadores', 'mr scouting', 'big data fútbol'],
  openGraph: {
    title: 'MR. SCOUTING | Análisis Élite',
    description: "Diseña tácticas y descubre talento con la plataforma líder para profesionales del fútbol.",
    url: '/',
    siteName: 'MR. SCOUTING',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MR. SCOUTING | Análisis Élite',
    description: "Diseña tácticas y descubre talento con la plataforma líder para profesionales del fútbol.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${spaceGrotesk.className} bg-[#0a0f1e] text-slate-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
