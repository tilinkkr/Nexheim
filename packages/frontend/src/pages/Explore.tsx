import ExploreHeader from "../components/explore/ExploreHeader";
import TokenCard from "../components/explore/TokenCard";

// Mock Data (Replace with API later)
const MOCK_TOKENS = [
    { id: 1, name: "UltraSafe", ticker: "ULTR", score: 94, status: "SAFE" as const, audits: 3, scams: 0 },
    { id: 2, name: "ApeChain", ticker: "APECX", score: 55, status: "MEDIUM" as const, audits: 1, scams: 1 },
    { id: 3, name: "FlokiPepe", ticker: "FLOK", score: 86, status: "SAFE" as const, audits: 12, scams: 0 },
    { id: 4, name: "MemeScam", ticker: "MEMEX", score: 20, status: "HIGH RISK" as const, audits: 0, scams: 14 },
    { id: 5, name: "DogeKing", ticker: "DKING", score: 63, status: "MEDIUM" as const, audits: 2, scams: 2 },
    { id: 6, name: "SafeMoon2", ticker: "SFM2", score: 12, status: "HIGH RISK" as const, audits: 0, scams: 52 },
];

const Explore = () => {
    return (
        <div className="min-h-screen bg-nex-bg p-6 md:p-12 text-white">
            {/* Background Ambient Glow */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nex-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nex-safe/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto">
                <ExploreHeader />

                {/* The Grid System */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_TOKENS.map((token) => (
                        <TokenCard key={token.id} data={token} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Explore;
