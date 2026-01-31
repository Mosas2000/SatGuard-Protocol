import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserSession, AppConfig } from '@stacks/connect';
import Header from './components/Header';
import LandingPage from './components/LandingPage';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function App() {
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserAddress(userData.profile.stxAddress.mainnet);
    }
  }, []);

  const handleConnect = (address: string) => {
    setUserAddress(address);
  };

  const handleDisconnect = () => {
    setUserAddress(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Header
          userAddress={userAddress}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pools" element={<div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-4xl font-bold">Pools Coming Soon</h1></div>} />
          <Route path="/create" element={<div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-4xl font-bold">Create Pool Coming Soon</h1></div>} />
          <Route path="/dashboard" element={<div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-4xl font-bold">Dashboard Coming Soon</h1></div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
