import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { registerables, Chart as ChartJS } from "chart.js";
import { Home } from "./pages/home/Home";
import { MyEmpireApp } from "./pages/app/MyEmpireApp";
import { WalletContextProvider } from "./contexts/WalletContext/WalletContextProvider";
import { LoginPage } from "./pages/login/LoginPage";
import { AuthContextProvider } from "./contexts/AuthContext/AuthContextProvider";
import { ProtectedRoute } from "./utilies/ProtectedPage";
import { BatchContextProvider } from "./contexts/BatchContext/BatchContextProvider";
import { DataContextProvider } from "./contexts/DataContext/DataContextProvider";
import { AppContextProvider } from "./contexts/AppContext/AppContextProvider";
import { ThemeContextProvider } from "./contexts/ThemeContext/ThemeContextProvider";
import { SelectWalletPage } from "./pages/selectWallet/SelectWalletPage";

// Register Chart.js to enable chart rendering
ChartJS.register(...registerables);

function App() {
  return (
    <Router basename="/myEmpireApp">
      <ThemeContextProvider>
        <AuthContextProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route
                element={
                  <WalletContextProvider>
                    <Outlet />
                  </WalletContextProvider>
                }
              >
                <Route
                  path="/app"
                  element={
                    <BatchContextProvider>
                      <DataContextProvider>
                        <AppContextProvider>
                          <MyEmpireApp />
                        </AppContextProvider>
                      </DataContextProvider>
                    </BatchContextProvider>
                  }
                />
                <Route path="/select-wallet" element={<SelectWalletPage />} />
              </Route>
            </Route>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </AuthContextProvider>
      </ThemeContextProvider>
    </Router>
  );
}

export default App;
