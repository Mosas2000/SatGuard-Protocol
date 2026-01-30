export default function PoolList() {
    return (
        <div>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Active Insurance Pools</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px' }}>Pool #1</h3>
                        <span style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}>
                            Active
                        </span>
                    </div>
                    <p style={{ color: '#666', marginBottom: '16px' }}>Exchange Hack Protection</p>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Total Funds:</span>
                            <strong>0.5 sBTC</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Contributors:</span>
                            <strong>3</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Min. Contribution:</span>
                            <strong>0.1 sBTC</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Max Coverage:</span>
                            <strong>1.0 sBTC</strong>
                        </div>
                    </div>
                    <button style={{
                        width: '100%',
                        marginTop: '16px',
                        background: '#F7931A',
                        color: 'white'
                    }}>
                        View Details
                    </button>
                </div>

                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px' }}>Pool #2</h3>
                        <span style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                        }}>
                            Active
                        </span>
                    </div>
                    <p style={{ color: '#666', marginBottom: '16px' }}>Rug Pull Protection</p>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Total Funds:</span>
                            <strong>1.2 sBTC</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Contributors:</span>
                            <strong>5</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Min. Contribution:</span>
                            <strong>0.2 sBTC</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Max Coverage:</span>
                            <strong>2.0 sBTC</strong>
                        </div>
                    </div>
                    <button style={{
                        width: '100%',
                        marginTop: '16px',
                        background: '#F7931A',
                        color: 'white'
                    }}>
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}
