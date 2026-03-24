import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PetroApply Admin',
  description: 'Admin dashboard for PetroApply career platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[#FDFDFC] text-[#0A261D] min-h-screen relative font-sans" suppressHydrationWarning>
        
        {/* Global CSS Noise Overlay */}
        <svg className="pointer-events-none fixed inset-0 z-[100] h-[100dvh] w-full opacity-5">
          <filter id="globalNoiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#globalNoiseFilter)" />
        </svg>

        {/* Global Subtle Background Grid */}
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
             style={{
               backgroundImage: 'linear-gradient(to right, #0A261D 1px, transparent 1px), linear-gradient(to bottom, #0A261D 1px, transparent 1px)',
               backgroundSize: '120px 120px',
               maskImage: 'radial-gradient(ellipse at top left, black 20%, transparent 80%)',
               WebkitMaskImage: 'radial-gradient(ellipse at top left, black 20%, transparent 80%)'
             }} 
        />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
