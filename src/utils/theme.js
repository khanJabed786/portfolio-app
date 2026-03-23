const THEME_KEY = "portfolio-theme";

export function getTheme() {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem(THEME_KEY) || "dark";
}

export function setTheme(theme) {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme) {
  if (typeof window === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  document.body.setAttribute("data-theme", theme);
  
  if (theme === "light") {
    document.documentElement.style.colorScheme = "light";
  } else {
    document.documentElement.style.colorScheme = "dark";
  }
}