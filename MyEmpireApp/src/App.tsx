import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import { Home } from "./components/pages/Home";
import { NoRouteMatch } from "./components/pages/NoRouteMatch";
import { MyEmpireApp } from "./components/pages/MyEmpireApp";
import { AppContextProvider } from "./contexts/AppContext/AppContextProvider";
import { PortofolioContextProvider } from "./contexts/PortfolioContext/PortfolioContextProvider";
import { AssetContextProvider } from "./contexts/AssetContext/AppContextProvider";

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
      <Routes>
        <Route
          path="/app"
          element={
            <AppContextProvider>
              <PortofolioContextProvider>
                <AssetContextProvider>
                  <MyEmpireApp />
                </AssetContextProvider>
              </PortofolioContextProvider>
            </AppContextProvider>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NoRouteMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
