import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { registerables, Chart as ChartJS } from "chart.js";
import { Home } from "./pages/home/Home";
import { NoRouteMatch } from "./pages/NoRouteMatch";
import { MyEmpireApp } from "./pages/app/MyEmpireApp";
import { AppContextProvider } from "./contexts/AppContext/AppContextProvider";
import { PortofolioContextProvider } from "./contexts/PortfolioContext/PortfolioContextProvider";
import { AssetContextProvider } from "./contexts/AssetContext/AssetContextProvider";
import { DateContextProvider } from "./contexts/DateContext/DateContextProvider";

// Register Chart.js to enable chart rendering
ChartJS.register(...registerables);

function App() {
  return (
    <Router basename="/myEmpireApp">
      <Routes>
        <Route
          path="/app"
          element={
            <AppContextProvider>
              <PortofolioContextProvider>
                <AssetContextProvider>
                  <DateContextProvider>
                    <MyEmpireApp />
                  </DateContextProvider>
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
