import type { Color } from "../../types/PortfolioTypes";

export const getFadedColor = (color: Color, alpha: number = 0.5) => {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`; // Return a string in rgba format with alpha
};

export const getColorString = (c: Color) => {
  return `rgba(${c.r}, ${c.g}, ${c.b})`; // Return a string in rgba format
};
