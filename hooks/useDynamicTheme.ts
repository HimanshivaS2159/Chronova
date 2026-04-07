"use client";

import { useEffect, useState } from "react";

export function useDynamicTheme(imageUrl: string | null) {
  const [dominantColor, setDominantColor] = useState<[number, number, number] | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    const handleLoad = () => {
      try {
        const ColorThief = require("colorthief");
        const colorThief = new ColorThief();
        const rgb = colorThief.getColor(img);
        if (rgb && Array.isArray(rgb)) {
          setDominantColor(rgb as [number, number, number]);
          
          // Update CSS variables for accent theme
          const [r, g, b] = rgb;
          const root = document.documentElement;
          root.style.setProperty("--accent-500", `rgb(${r}, ${g}, ${b})`);
          root.style.setProperty("--accent-600", `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`);
          root.style.setProperty("--accent-400", `rgb(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)})`);
          root.style.setProperty("--accent-100", `rgba(${r}, ${g}, ${b}, 0.1)`);
          root.style.setProperty("--accent-200", `rgba(${r}, ${g}, ${b}, 0.2)`);
          root.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
        }
      } catch (err) {
        console.error("Failed to extract color:", err);
      }
    };

    img.addEventListener("load", handleLoad);
    return () => img.removeEventListener("load", handleLoad);
  }, [imageUrl]);

  return { dominantColor };
}
