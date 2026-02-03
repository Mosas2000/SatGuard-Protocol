import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, utf8CV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME, MICRO_STACKS } from '../utils/constants';

interface PoolTemplatesProps {
    onTemplateSelect?: (template: PoolTemplate) => void;
}

export interface PoolTemplate {
    id: string;
    name: string;
    description: string;
    category: 'defi' | 'exchange' | 'nft' | 'general';
    minContribution: number; // in STX
    maxCoverage: number; // in STX
    suggestedPremiumRate: number; // percentage
    features: string[];
    icon: string;
}

export default function PoolTemplates({ onTemplateSelect }: PoolTemplatesProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTemplate, setSelectedTemplate] = useState<PoolTemplate | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const templates: PoolTemplate[] = [
        {
            id: 'exchange-hack',
            name: 'Exchange Hack Insurance',
            description: 'Protect against centralized exchange hacks and security breaches',
            category: 'exchange',
            minContribution: 0.1,
            maxCoverage: 10,
            suggestedPremiumRate: 5,
            features: ['24/7 monitoring', 'Fast claim processing', 'Multi-exchange coverage'],
            icon: '🏦'
        },
        {
            id: 'rug-pull',
            name: 'Rug Pull Protection',
            description: 'Insurance against token rug pulls and exit scams',
            category: 'defi',
            minContribution: 0.05,
            maxCoverage: 5,
            suggestedPremiumRate: 8,
            features: ['Smart contract analysis', 'Team verification', 'Liquidity monitoring'],
            icon: '🚨'
        },
        {
            id: 'smart-contract',
            name: 'Smart Contract Risk',
            description: 'Coverage for smart contract vulnerabilities and exploits',
            category: 'defi',
            minContribution: 0.2,
            maxCoverage: 20,
            suggestedPremiumRate: 6,
            features: ['Audit verification', 'Code review', 'Bug bounty integration'],
            icon: '📜'
        },
        {
            id: 'nft-theft',
            name: 'NFT Theft Protection',
            description: 'Protect valuable NFTs from theft and unauthorized transfers',
            category: 'nft',
            minContribution: 0.1,
            maxCoverage: 15,
            suggestedPremiumRate: 7,
            features: ['Wallet monitoring', 'Transaction alerts', 'Recovery assistance'],
            icon: '🖼️'
        },
        {
            id: 'bridge-risk',
            name: 'Bridge Risk Coverage',
            description: 'Insurance for cross-chain bridge vulnerabilities',
            category: 'defi',
            minContribution: 0.15,
            maxCoverage: 12,
            suggestedPremiumRate: 9,
            features: ['Multi-chain support', 'Bridge monitoring', 'Rapid response'],
            icon: '🌉'
        },
        {
            id: 'general-defi',
            name: 'General DeFi Protection',
            description: 'Comprehensive coverage for various DeFi risks',
            category: 'general',
            minContribution: 0.1,
            maxCoverage: 8,
            suggestedPremiumRate: 5,
            features: ['Flexible coverage', 'Multiple protocols', 'Community governance'],
            icon: '🛡️'
        }
    ];

    const categories = [
        { id: 'all', name: 'All Templates', icon: '📋' },
        { id: 'defi', name: 'DeFi', icon: '💰' },
        { id: 'exchange', name: 'Exchange', icon: '🏦' },
        { id: 'nft', name: 'NFT', icon: '🖼️' },
        { id: 'general', name: 'General', icon: '🛡️' }
    ];

    const filteredTemplates = selectedCategory === 'all'
        ? templates
        : templates.filter(t => t.category === selectedCategory);

    const handleCreateFromTemplate = async (template: PoolTemplate) => {
        setShowCreateModal(true);
        setSelectedTemplate(template);
    };

    const executeCreate = async () => {
        if (!selectedTemplate) return;

        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'create-pool',
                functionArgs: [
                    utf8CV(selectedTemplate.name),
                    uintCV(selectedTemplate.minContribution * MICRO_STACKS),
                    uintCV(selectedTemplate.maxCoverage * MICRO_STACKS)
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Pool created:', data);
                    alert(`Pool created from ${selectedTemplate.name} template!`);
                    setShowCreateModal(false);
                    onTemplateSelect?.(selectedTemplate);
                },
                onCancel: () => {
                    console.log('Cancelled');
                }
            });
        } catch (err) {
            console.error(err);
            alert('Failed to create pool');
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Pool Templates Library</h2>
                <p className="text-gray-600">Choose a pre-configured template to quickly launch your insurance pool</p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${selectedCategory === cat.id
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {cat.icon} {cat.name}
                    </button>
                ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(template => (
                    <div
                        key={template.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200"
                    >
                        <div className="p-6">
                            {/* Icon & Title */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="text-4xl">{template.icon}</div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{template.name}</h3>
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                        {template.category.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                            {/* Specs */}
                            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Min Contribution:</span>
                                    <span className="font-semibold text-gray-900">{template.minContribution} STX</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Max Coverage:</span>
                                    <span className="font-semibold text-gray-900">{template.maxCoverage} STX</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Premium Rate:</span>
                                    <span className="font-semibold text-gray-900">{template.suggestedPremiumRate}%</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mb-4">
                                <div className="text-xs font-semibold text-gray-700 mb-2">FEATURES:</div>
                                <ul className="space-y-1">
                                    {template.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-xs text-gray-600">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleCreateFromTemplate(template)}
                                className="w-full py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition"
                            >
                                Use Template
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {showCreateModal && selectedTemplate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Create Pool from Template
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="text-3xl">{selectedTemplate.icon}</div>
                                <div className="font-bold text-gray-900">{selectedTemplate.name}</div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Min Contribution:</span>
                                    <span className="font-semibold">{selectedTemplate.minContribution} STX</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Max Coverage:</span>
                                    <span className="font-semibold">{selectedTemplate.maxCoverage} STX</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Premium Rate:</span>
                                    <span className="font-semibold">{selectedTemplate.suggestedPremiumRate}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeCreate}
                                className="flex-1 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                                Create Pool
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
