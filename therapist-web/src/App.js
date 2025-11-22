import React from 'react';
import PatientDashboard from './components/PatientDashboard';
import MarketingAgent from './components/MarketingAgent';
import MarketingPerformanceAnalyzer from './components/MarketingPerformanceAnalyzer';

import './components/MarketingPerformanceAnalyzer.css';
import './App.css'; // Para estilos globais

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sinergia Pro - Dashboard do Terapeuta</h1>
      </header>
      <main className="App-main">
        <PatientDashboard />
        <MarketingAgent />
        <MarketingPerformanceAnalyzer />
      </main>
    </div>
  );
}

export default App;
