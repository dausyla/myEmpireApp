import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/pages/Dashboard";
import { PortofolioContextProvider } from "./contexts/DataContext/PortfolioContextProvider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js to enable chart rendering
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  return (
    <Router>
      <PortofolioContextProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </PortofolioContextProvider>
    </Router>
  );
}

export default App;
