import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold text-black mb-6">
                        Bitcoin-Backed Insurance
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Decentralized protection against exchange hacks, rug pulls, and market risks.
                        Powered by sBTC on Stacks.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/pools"
                            className="px-8 py-3 bg-stacks-orange text-white rounded hover:bg-orange-600 transition font-medium"
                        >
                            Browse Pools
                        </Link>
                        <Link
                            to="/create"
                            className="px-8 py-3 border border-black text-black rounded hover:bg-black hover:text-white transition font-medium"
                        >
                            Create Pool
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-20">
                    <div className="border border-gray-200 p-8 rounded">
                        <h3 className="text-2xl font-bold text-black mb-4">Decentralized</h3>
                        <p className="text-gray-600">
                            No central authority. Community-driven insurance pools with transparent voting.
                        </p>
                    </div>
                    <div className="border border-gray-200 p-8 rounded">
                        <h3 className="text-2xl font-bold text-black mb-4">Bitcoin-Backed</h3>
                        <p className="text-gray-600">
                            All pools backed by sBTC. Real Bitcoin security for your digital assets.
                        </p>
                    </div>
                    <div className="border border-gray-200 p-8 rounded">
                        <h3 className="text-2xl font-bold text-black mb-4">Transparent</h3>
                        <p className="text-gray-600">
                            Every contribution, claim, and vote recorded immutably on the blockchain.
                        </p>
                    </div>
                </div>

                <div className="mt-20 border-t border-gray-200 pt-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-black mb-4">How It Works</h2>
                            <ol className="space-y-4 text-gray-700">
                                <li className="flex gap-3">
                                    <span className="font-bold text-stacks-orange">1.</span>
                                    <span>Contributors pool sBTC for specific insurance coverage</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-stacks-orange">2.</span>
                                    <span>When losses occur, members submit claims with evidence</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-stacks-orange">3.</span>
                                    <span>Pool members vote on claims based on their contribution</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-stacks-orange">4.</span>
                                    <span>Approved claims receive automatic payouts from the pool</span>
                                </li>
                            </ol>
                        </div>
                        <div className="border border-gray-200 p-8 rounded">
                            <h3 className="text-2xl font-bold text-black mb-4">Get Started</h3>
                            <p className="text-gray-600 mb-6">
                                Connect your Stacks wallet to start contributing to insurance pools or create your own.
                            </p>
                            <Link
                                to="/pools"
                                className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                            >
                                View All Pools
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
