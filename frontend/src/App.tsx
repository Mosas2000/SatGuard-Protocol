import { useState } from 'react'
import WalletConnect from './components/WalletConnect'
import PoolList from './components/PoolList'
import CreatePool from './components/CreatePool'
import './App.css'

function App() {
    const [userAddress, setUserAddress] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'browse' | 'create'>('browse');

    return (
        <div className="app">
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <h1 className="logo">SatGuard Protocol</h1>
                        <WalletConnect onConnect={setUserAddress} />
                    </div>
                </div>
            </header>

            <main className="main">
                <div className="container">
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'browse' ? 'active' : ''}`}
                            onClick={() => setActiveTab('browse')}
                        >
                            Browse Pools
                        </button>
                        <button
                            className={`tab ${activeTab === 'create' ? 'active' : ''}`}
                            onClick={() => setActiveTab('create')}
                        >
                            Create Pool
                        </button>
                    </div>

                    <div className="tab-content">
                        {activeTab === 'browse' ? (
                            <PoolList />
                        ) : (
                            <CreatePool userAddress={userAddress} />
                        )}
                    </div>
                </div>
            </main>

            <footer className="footer">
                <div className="container">
                    <p>Bitcoin-backed micro-insurance on Stacks blockchain</p>
                </div>
            </footer>
        </div>
    )
}

export default App
