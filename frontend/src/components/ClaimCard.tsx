import type { Claim } from '../types';

interface ClaimCardProps {
    claim: Claim;
    onVote?: (claimId: number, support: boolean) => void;
}

export default function ClaimCard({ claim, onVote }: ClaimCardProps) {
    const statusColors = {
        0: 'bg-yellow-100 text-yellow-800',
        1: 'bg-green-100 text-green-800',
        2: 'bg-red-100 text-red-800',
    };

    const statusText = {
        0: 'Pending',
        1: 'Approved',
        2: 'Rejected',
    };

    const totalVotes = claim.votesFor + claim.votesAgainst;
    const approvalRate = totalVotes > 0 ? (claim.votesFor / totalVotes) * 100 : 0;

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[claim.status as keyof typeof statusColors]
                    }`}>
                        {statusText[claim.status as keyof typeof statusText]}
                    </span>
                </div>
                <span className="text-sm text-gray-500">Claim #{claim.claimId}</span>
            </div>

            <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Amount Requested</p>
                <p className="text-2xl font-bold text-black">
                    {(claim.amount / 1000000).toFixed(2)} STX
                </p>
            </div>

            <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Reason</p>
                <p className="text-gray-800">{claim.reason}</p>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Approval Rate</span>
                    <span>{approvalRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${approvalRate}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>👍 {claim.votesFor}</span>
                    <span>👎 {claim.votesAgainst}</span>
                </div>
            </div>

            {claim.status === 0 && onVote && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onVote(claim.claimId, true)}
                        className="flex-1 bg-green-500 text-white py-2 rounded font-medium hover:bg-green-600"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => onVote(claim.claimId, false)}
                        className="flex-1 bg-red-500 text-white py-2 rounded font-medium hover:bg-red-600"
                    >
                        Reject
                    </button>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                Submitted: {new Date(claim.submittedAt * 1000).toLocaleDateString()}
            </div>
        </div>
    );
}
