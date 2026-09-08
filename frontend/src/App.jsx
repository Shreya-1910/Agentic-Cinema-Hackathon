import { useState } from 'react';
import Navigation from './components/Layout/Navigation';
import GreenlightReport from './components/GreenlightReport/GreenlightReport';
import LogViewer from './components/LogViewer/LogViewer';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('report');

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0E1116',
      fontFamily: 'sans-serif'
    }}>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main>
        {/* Only ONE of these will show at a time based on activeTab */}
        {activeTab === 'report' && <GreenlightReport />}  {/* ← Only once! */}
        {activeTab === 'logs' && <LogViewer />}
        {activeTab === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}

export default App;