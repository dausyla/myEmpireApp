import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { registerables, Chart as ChartJS } from "chart.js";
import { Home } from "./pages/home/Home";
import { NoRouteMatch } from "./pages/NoRouteMatch";
import { MyEmpireApp } from "./pages/app/MyEmpireApp";
import { WalletContextProvider } from "./contexts/WalletContext/WalletContextProvider";
import { LoginPage } from "./pages/login/LoginPage";
import { AuthContextProvider } from "./contexts/AuthContext/AuthContextProvider";
import { ProtectedRoute } from "./utilies/ProtectedPage";
import { BatchContextProvider } from "./contexts/BatchContext/BatchContextProvider";
import { DataContextProvider } from "./contexts/DataContext/DataContextProvider";
import { AppContextProvider } from "./contexts/AppContext/AppContextProvider";
import { ThemeContextProvider } from "./contexts/ThemeContext/ThemeContextProvider";

// Register Chart.js to enable chart rendering
ChartJS.register(...registerables);

function App() {
  return (
    <Router basename="/myEmpireApp">
      <ThemeContextProvider>
        <AuthContextProvider>
          <Routes>
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <WalletContextProvider>
                    <BatchContextProvider>
                      <DataContextProvider>
                        <AppContextProvider>
                          <MyEmpireApp />
                        </AppContextProvider>
                      </DataContextProvider>
                    </BatchContextProvider>
                  </WalletContextProvider>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NoRouteMatch />} />
          </Routes>
        </AuthContextProvider>
      </ThemeContextProvider>
    </Router>
  );
}

export default App;
