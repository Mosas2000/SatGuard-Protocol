import { Claim } from '../types';
import { formatAmount, CLAIM_STATUS } from '../utils/constants';
import { getAddressUrl } from '../utils/network';

interface ClaimsListProps {
    claims: Claim[];
    userAddress: string | null;
    hasContributed: boolean;
    onVote: (claimId: number, vote: boolean) => void;
}

export default function ClaimsList({ claims, userAddress, hasContributed, onVote }: ClaimsListProps) {
    const getStatusLabel = (status: number) => {
        switch (status) {
            case CLAIM_STATUS.PENDING: return { label: 'Pending', classes: 'bg-yellow-100 text-yellow-800' };
            case CLAIM_STATUS.APPROVED: return { label: 'Approved', classes: 'bg-green-100 text-green-800' };
            case CLAIM_STATUS.REJECTED: return { label: 'Rejected', classes: 'bg-red-100 text-red-800' };
            case CLAIM_STATUS.PAID: return { label: 'Paid', classes: 'bg-blue-100 text-blue-800' };
            default: return { label: 'Unknown', classes: 'bg-gray-100 text-gray-800' };
        }
    };

    if (claims.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded border border-dashed border-gray-300">
                <p className="text-gray-500">No claims submitted for this pool yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {claims.map((claim) => {
                const status = getStatusLabel(claim.status);
                const isPending = claim.status === CLAIM_STATUS.PENDING;

                return (
                    <div key={claim.claimId} className="border border-gray-200 rounded p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-lg text-black">Claim #{claim.claimId}</h4>
                                <p className="text-sm text-gray-600">
                                    By: <a href={getAddressUrl(claim.claimant)} target="_blank" rel="noreferrer" className="font-mono hover:text-stacks-orange transition">
                                        {claim.claimant.slice(0, 8)}...{claim.claimant.slice(-6)}
                                    </a>
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${status.classes}`}>
                                {status.label}
                            </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Requested Amount</p>
                                <p className="text-xl font-mono font-bold text-black">{formatAmount(claim.amount)} sBTC</p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Voting Status</p>
                                <div className="flex gap-4 items-center">
                                    <span className="text-green-600 font-bold">✓ {claim.votesFor}</span>
                                    <span className="text-red-600 font-bold">✗ {claim.votesAgainst}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 text-xs uppercase tracking-wider mb-1">Reason / Evidence</p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded text-sm italic border-l-4 border-gray-200">
                                "{claim.reason}"
                            </p>
                        </div>

                        {isPending && hasContributed && (
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => onVote(claim.claimId, true)}
                                    className="flex-1 py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-700 transition"
                                >
                                    Vote For Approval
                                </button>
                                <button
                                    onClick={() => onVote(claim.claimId, false)}
                                    className="flex-1 py-2 bg-red-600 text-white text-sm font-bold rounded hover:bg-red-700 transition"
                                >
                                    Vote Against
                                </button>
                            </div>
                        )}

                        {isPending && !hasContributed && userAddress && (
                            <p className="text-xs text-gray-500 text-center italic mt-2">
                                Only pool members can vote on claims.
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
