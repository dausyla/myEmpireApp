import { NavBar } from "../navbar/Navbar";
import { useState } from "react";
import { PortofolioContextProvider } from "../../contexts/DataContext/PortfolioContextProvider";
import { Predictions } from "./myEmpireAppComponents/Predictions";
import { Assets } from "./myEmpireAppComponents/Assets";

export function MyEmpireApp() {
  const [currentNav, setCurrentNav] = useState("predictions");

  return (
    <PortofolioContextProvider>
      <NavBar setCurrentNav={setCurrentNav} />

      {/* Main content starts below the NavBar */}
      {currentNav === "predictions" && <Predictions />}
      {currentNav === "assets" && <Assets />}
    </PortofolioContextProvider>
  );
}
