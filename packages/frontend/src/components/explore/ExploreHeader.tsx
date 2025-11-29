import { Search, Filter } from "lucide-react";

const ExploreHeader = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">

            {/* Text Section */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                    Live Token Feed <span className="text-nex-primary">⚡</span>
                </h1>
                <p className="text-gray-400 text-sm">Real-time meme coin detection & audit stream</p>
            </div>

            {/* The Holographic Search */}
            <div className="relative w-full md:w-96 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-500 group-focus-within:text-nex-primary transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search contract address or name..."
                    className="block w-full pl-10 pr-3 py-3 border border-nex-stroke rounded-xl leading-5 bg-black/50 text-gray-300 placeholder-gray-600 
          focus:outline-none focus:bg-gray-900 focus:border-nex-primary focus:ring-1 focus:ring-nex-primary sm:text-sm transition-all shadow-lg"
                />
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                    <button className="p-1 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition">
                        <Filter size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExploreHeader;
