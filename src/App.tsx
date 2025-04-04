import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css'; // <-- Tailwind first
import './App.css';   // <-- Your custom styles
import GeneOverview from './components/GeneOverview';

function App() {
  return (
    <Router>
      <div className="p-4">
        <h1 className="text-blue-500">Hello Tailwind</h1>
        <h1 className="font-bold text-2xl underline text-red-700">Hello React</h1>
        <Routes>
          <Route path="/" element={<GeneOverview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
