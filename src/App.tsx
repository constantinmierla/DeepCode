import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css"; // <-- Tailwind first
import "./App.css"; // <-- Your custom styles
import MainComponent from "./components/MainComponent";
import LoadingComponent from "./components/LoadingComponent";

function App() {
  return (
    <Router>
      <LoadingComponent
        children={<MainComponent></MainComponent>}
      ></LoadingComponent>
    </Router>
  );
}

export default App;
