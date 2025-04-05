import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'; // <-- Tailwind first
import './App.css';   // <-- Your custom styles
import GeneOverview from './components/GeneOverview';

function App() {
  return (
    <Router>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<GeneOverview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
