import React, {useEffect} from "react";
import Dashboard from "./component/Dashboard";
import InputStock from "./component/InputStock";
import ScanStock from "./component/ScanStock";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { toggleTheme } from "../src/redux/slices/themeSlice";
import { langToggle } from "../src/redux/slices/langSlice";

function App() {
  const { theme } = useSelector((state) => state.theme);
  const { lang } = useSelector((state) => state.lang);
  const dispatch = useDispatch();

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);
  return (
    <div className={`${theme}`}>
    <Router>
    <div className="tools">
        <button onClick={() => dispatch(langToggle())}>
          {lang === "en" ? "EN" : "ID"}
        </button>
        <button onClick={() => dispatch(toggleTheme())}>
          {theme === "light" ? (
            <i className="bi bi-sun"></i>
          ) : (
            <i className="bi bi-moon"></i>
          )}
        </button>
      </div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/stock-in" element={<InputStock />} />
        <Route path="/stock-out" element={<ScanStock />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;