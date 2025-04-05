import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css"; // <-- Tailwind first
import "./App.css"; // <-- Your custom styles
import MainComponent from "./components/MainComponent";

function App() {
  return (
    <Router>
      <MainComponent></MainComponent>
    </Router>
  );
}

export default App;
