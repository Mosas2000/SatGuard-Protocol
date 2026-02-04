import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, utf8CV, PostConditionMode } from '@stacks/transactions';
import { network } from '../utils/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from '../utils/constants';

interface ProposalCreatorProps {
    poolId: number;
    onProposalCreated?: () => void;
}

type ProposalType = 'parameter-change' | 'pool-upgrade' | 'emergency-action' | 'general';

interface ProposalTemplate {
    type: ProposalType;
    title: string;
    description: string;
    fields: { name: string; label: string; type: 'text' | 'number'; placeholder: string }[];
}

export default function ProposalCreator({ poolId, onProposalCreated }: ProposalCreatorProps) {
    const [selectedType, setSelectedType] = useState<ProposalType>('general');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [votingDuration, setVotingDuration] = useState(14); // days
    const [loading, setLoading] = useState(false);

    const templates: ProposalTemplate[] = [
        {
            type: 'parameter-change',
            title: 'Change Pool Parameters',
            description: 'Modify pool settings such as coverage limits, premium rates, or voting thresholds',
            fields: [
                { name: 'parameter', label: 'Parameter Name', type: 'text', placeholder: 'e.g., max-coverage' },
                { name: 'newValue', label: 'New Value', type: 'number', placeholder: 'e.g., 15' },
                { name: 'reason', label: 'Reason for Change', type: 'text', placeholder: 'Explain why this change is needed' }
            ]
        },
        {
            type: 'pool-upgrade',
            title: 'Pool Upgrade Proposal',
            description: 'Propose an upgrade to pool smart contract or functionality',
            fields: [
                { name: 'upgrade', label: 'Upgrade Description', type: 'text', placeholder: 'Describe the upgrade' },
                { name: 'contractHash', label: 'New Contract Hash', type: 'text', placeholder: '0x...' },
                { name: 'benefits', label: 'Expected Benefits', type: 'text', placeholder: 'List the benefits' }
            ]
        },
        {
            type: 'emergency-action',
            title: 'Emergency Action',
            description: 'Propose emergency action such as pausing the pool or emergency withdrawal',
            fields: [
                { name: 'action', label: 'Emergency Action', type: 'text', placeholder: 'e.g., Pause pool operations' },
                { name: 'urgency', label: 'Urgency Level', type: 'text', placeholder: 'Critical/High/Medium' },
                { name: 'justification', label: 'Justification', type: 'text', placeholder: 'Explain the emergency' }
            ]
        },
        {
            type: 'general',
            title: 'General Proposal',
            description: 'Create a custom proposal for community discussion and voting',
            fields: [
                { name: 'topic', label: 'Proposal Topic', type: 'text', placeholder: 'What is this proposal about?' },
                { name: 'details', label: 'Proposal Details', type: 'text', placeholder: 'Provide detailed information' }
            ]
        }
    ];

    const currentTemplate = templates.find(t => t.type === selectedType);

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await openContractCall({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACT_NAME,
                functionName: 'create-proposal',
                functionArgs: [
                    uintCV(poolId),
                    utf8CV(title),
                    utf8CV(description),
                    uintCV(votingDuration)
                ],
                network,
                postConditionMode: PostConditionMode.Deny,
                onFinish: (data) => {
                    console.log('Proposal created:', data);
                    setLoading(false);
                    alert('Proposal created successfully!');
                    onProposalCreated?.();
                },
                onCancel: () => {
                    setLoading(false);
                }
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
            alert('Failed to create proposal');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Governance Proposal</h2>
            <p className="text-gray-600 mb-8">Submit a proposal for community voting</p>

            {/* Proposal Type Selection */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Proposal Type</h3>
                <div className="grid grid-cols-2 gap-4">
                    {templates.map(template => (
                        <div
                            key={template.type}
                            onClick={() => setSelectedType(template.type)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition ${selectedType === template.type
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="font-bold text-gray-900 mb-1">{template.title}</div>
                            <div className="text-sm text-gray-600">{template.description}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Proposal Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proposal Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                        placeholder="Enter a clear, concise title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proposal Description *
                    </label>
                    <textarea
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                        placeholder="Provide detailed information about your proposal..."
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        {description.length}/2000 characters
                    </div>
                </div>

                {/* Template-specific fields */}
                {currentTemplate && currentTemplate.fields.map(field => (
                    <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field.label}
                        </label>
                        {field.type === 'text' ? (
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                                placeholder={field.placeholder}
                            />
                        ) : (
                            <input
                                type="number"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                                placeholder={field.placeholder}
                            />
                        )}
                    </div>
                ))}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voting Duration (days)
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="30"
                        value={votingDuration}
                        onChange={(e) => setVotingDuration(parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 outline-none"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        Recommended: 7-14 days for standard proposals, 3-7 days for urgent matters
                    </div>
                </div>
            </div>

            {/* Proposal Preview */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-purple-900 mb-3">Proposal Preview</h3>
                <div className="bg-white rounded p-4 space-y-2">
                    <div className="font-bold text-gray-900">{title || 'Untitled Proposal'}</div>
                    <div className="text-sm text-gray-600">{description || 'No description provided'}</div>
                    <div className="flex gap-4 text-xs text-gray-500 pt-2 border-t">
                        <span>Type: {currentTemplate?.title}</span>
                        <span>Duration: {votingDuration} days</span>
                        <span>Pool: #{poolId}</span>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={loading || !title.trim() || !description.trim()}
                className={`w-full py-3 rounded-lg font-bold transition ${loading || !title.trim() || !description.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
            >
                {loading ? 'Creating Proposal...' : 'Submit Proposal'}
            </button>

            {/* Guidelines */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Proposal Guidelines</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Be clear and specific about what you're proposing</li>
                    <li>Provide rationale and expected benefits</li>
                    <li>Include relevant data and evidence</li>
                    <li>Consider potential risks and mitigation strategies</li>
                    <li>Engage with community feedback before voting</li>
                </ul>
            </div>
        </div>
    );
}
