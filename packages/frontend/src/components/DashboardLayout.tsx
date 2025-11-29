import { type ReactNode } from 'react';
import TopBar from './TopBar';
import BackgroundScene from './BackgroundScene';
import CommandPalette from './CommandPalette';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen text-white font-sans selection:bg-neon/30 selection:text-neon">
            <BackgroundScene />
            <TopBar />
            <CommandPalette />

            <main className="pt-20 w-full px-6 lg:px-12 py-8 min-h-screen relative z-10">
                {children}
            </main>
        </div>
    );
}
