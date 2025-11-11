import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { registerables, Chart as ChartJS } from "chart.js";
import { Home } from "./pages/home/Home";
import { NoRouteMatch } from "./pages/NoRouteMatch";
import { MyEmpireApp } from "./pages/app/MyEmpireApp";
import { WalletContextProvider } from "./contexts/WalletContext/WalletContextProvider";
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
                <WalletContextProvider>
                  <AssetContextProvider>
                    <DateContextProvider>
                      <MyEmpireApp />
                    </DateContextProvider>
                  </AssetContextProvider>
                </WalletContextProvider>
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
