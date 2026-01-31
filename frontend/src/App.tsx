import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserSession, AppConfig } from '@stacks/connect';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import PoolsList from './components/PoolsList';
import CreatePool from './components/CreatePool';
import PoolDetail from './components/PoolDetail';
import UserDashboard from './components/UserDashboard';

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
          <Route path="/pools" element={<PoolsList />} />
          <Route path="/pools/:id" element={<PoolDetail userAddress={userAddress} />} />
          <Route path="/create" element={<CreatePool />} />
          <Route path="/dashboard" element={<UserDashboard userAddress={userAddress} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
