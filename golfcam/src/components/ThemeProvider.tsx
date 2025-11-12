"use client";

import { ReactNode, useEffect } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const root = document.documentElement;
      root.classList.remove("theme-light", "theme-dark");
      root.classList.add(mq.matches ? "theme-dark" : "theme-light");
    };

    applyTheme();
    mq.addEventListener("change", applyTheme);
    return () => mq.removeEventListener("change", applyTheme);
  }, []);

  return <>{children}</>;
}