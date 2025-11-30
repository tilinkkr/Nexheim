import { Command } from 'cmdk';
import { useState, useEffect } from 'react';
import { Search, Zap, Shield, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        }
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[20vh]" onClick={() => setOpen(false)}>
            <div className="w-full max-w-xl bg-[#1a1a1a] border border-glass-outline rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                <Command className="w-full">
                    <div className="flex items-center border-b border-white/10 px-4">
                        <Search className="w-5 h-5 text-muted mr-3" />
                        <Command.Input
                            placeholder="Type a command or search..."
                            className="w-full bg-transparent py-4 text-white outline-none placeholder:text-muted font-mono"
                        />
                    </div>

                    <Command.List className="max-h-[300px] overflow-y-auto p-2">
                        <Command.Empty className="py-6 text-center text-muted text-sm">No results found.</Command.Empty>

                        <Command.Group heading="Navigation" className="text-xs text-muted font-bold px-2 py-1 mb-1">
                            <Command.Item onSelect={() => { navigate('/'); setOpen(false); }} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-white/10 cursor-pointer transition-colors">
                                <Zap className="w-4 h-4 text-neon" />
                                <span>Dashboard</span>
                            </Command.Item>
                            <Command.Item onSelect={() => { navigate('/mint'); setOpen(false); }} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-white/10 cursor-pointer transition-colors">
                                <TrendingUp className="w-4 h-4 text-electric" />
                                <span>Mint Token</span>
                            </Command.Item>
                            <Command.Item onSelect={() => { navigate('/audits'); setOpen(false); }} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-white/10 cursor-pointer transition-colors">
                                <Shield className="w-4 h-4 text-violet" />
                                <span>Audits</span>
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                </Command>
            </div>
        </div>
    );
}
