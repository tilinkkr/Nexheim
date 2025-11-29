import { type ReactNode } from 'react';
import TopBar from './TopBar';
import BackgroundScene from './BackgroundScene';
import CommandPalette from './CommandPalette';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen text-white font-sans selection:bg-neon/30 selection:text-neon">
            <BackgroundScene />
            <TopBar />
            <CommandPalette />

            <main className="pt-20 px-4 pb-12 max-w-[1600px] mx-auto relative z-10">
                {children}
            </main>
        </div>
    );
}
