import { useState } from 'react';

interface CreatePoolProps {
    userAddress: string;
}

export default function CreatePool({ userAddress }: CreatePoolProps) {
    const [coverageType, setCoverageType] = useState('');
    const [minContribution, setMinContribution] = useState('');
    const [maxCoverage, setMaxCoverage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAddress) {
            alert('Please connect your wallet first');
            return;
        }
        setLoading(true);
        // Contract interaction will be implemented here
        setTimeout(() => {
            alert('Pool creation functionality will be connected to smart contract');
            setLoading(false);
        }, 1000);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Create Insurance Pool</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Coverage Type
                        </label>
                        <input
                            type="text"
                            value={coverageType}
                            onChange={(e) => setCoverageType(e.target.value)}
                            placeholder="e.g., Exchange Hack Protection"
                            required
                            maxLength={50}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Minimum Contribution (sBTC)
                        </label>
                        <input
                            type="number"
                            value={minContribution}
                            onChange={(e) => setMinContribution(e.target.value)}
                            placeholder="0.1"
                            step="0.01"
                            min="0.01"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: '#333'
                        }}>
                            Maximum Coverage (sBTC)
                        </label>
                        <input
                            type="number"
                            value={maxCoverage}
                            onChange={(e) => setMaxCoverage(e.target.value)}
                            placeholder="1.0"
                            step="0.1"
                            min="0.1"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !userAddress}
                        style={{
                            width: '100%',
                            background: '#5546FF',
                            color: 'white',
                            padding: '14px',
                            fontSize: '16px'
                        }}
                    >
                        {loading ? 'Creating Pool...' : 'Create Pool'}
                    </button>

                    {!userAddress && (
                        <p style={{
                            marginTop: '16px',
                            textAlign: 'center',
                            color: '#666',
                            fontSize: '14px'
                        }}>
                            Please connect your wallet to create a pool
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
