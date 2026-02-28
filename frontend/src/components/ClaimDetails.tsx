interface ClaimDetailsProps {
    claimId: number;
    poolId: number;
    amount: number;
    reason: string;
    claimant: string;
}

export default function ClaimDetails({ claimId, poolId, amount, reason, claimant }: ClaimDetailsProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Claim Details</h3>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">Claim ID:</span>
                    <span className="font-semibold">#{claimId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Pool ID:</span>
                    <span className="font-semibold">#{poolId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">{(amount / 1000000).toFixed(2)} STX</span>
                </div>
                <div>
                    <span className="text-gray-600 block mb-2">Reason:</span>
                    <p className="bg-gray-50 p-3 rounded">{reason}</p>
                </div>
                <div>
                    <span className="text-gray-600 block mb-2">Claimant:</span>
                                               t-sm bg-gray-50 p-2 rounded break-all">{claimant}</p>
                </div>
            </div>
        </div>
    );
}
