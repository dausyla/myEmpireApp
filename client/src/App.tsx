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
import { LoginPage } from "./pages/login/LoginPage";
import { AuthContextProvider } from "./contexts/AuthContext/AuthContextProvider";
import { ProtectedRoute } from "./utilies/ProtectedPage";

// Register Chart.js to enable chart rendering
ChartJS.register(...registerables);

function App() {
  return (
    <Router basename="/myEmpireApp">
      <AuthContextProvider>
        <Routes>
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppContextProvider>
                  <PortofolioContextProvider>
                    <AssetContextProvider>
                      <DateContextProvider>
                        <MyEmpireApp />
                      </DateContextProvider>
                    </AssetContextProvider>
                  </PortofolioContextProvider>
                </AppContextProvider>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NoRouteMatch />} />
        </Routes>
      </AuthContextProvider>
    </Router>
  );
}

export default App;
