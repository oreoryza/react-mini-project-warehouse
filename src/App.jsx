import React from "react";
import Dashboard from "./component/Dashboard";
import InputStock from "./component/InputStock";
import ScanStock from "./component/ScanStock";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stock-in" element={<InputStock />} />
        <Route path="/stock-out" element={<ScanStock />} />
      </Routes>
      </Router>
    </>
  );
}

export default App;