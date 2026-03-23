import React, { createContext, useContext } from "react";
import usePortfolioData from "../utils/usePortfolioData.js";

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const portfolioData = usePortfolioData();

  return (
    <PortfolioContext.Provider value={portfolioData}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
}
