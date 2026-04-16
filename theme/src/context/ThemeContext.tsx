import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type BackgroundTheme = 'white' | 'black' | 'navy' | 'lunar' | 'custom';

export interface ThemeColors {
  primary: string;
  secondary: string;
  buttonPrimary: string;
  buttonSecondary: string;
}

export interface ThemeConfig {
  background: BackgroundTheme;
  customPrimary: string;
  customSecondary: string;
  buttonPrimary: string;
  buttonSecondary: string;
}

interface ThemeContextType {
  config: ThemeConfig;
  setBackground: (bg: BackgroundTheme) => void;
  setCustomColors: (primary: string, secondary: string) => void;
  setButtonColors: (primary: string, secondary: string) => void;
  resetTheme: () => void;
  presets: { name: string; background: BackgroundTheme; primary: string; secondary: string; buttonPrimary: string; buttonSecondary: string }[];
}

const defaultConfig: ThemeConfig = {
  background: 'white',
  customPrimary: '#10b981',
  customSecondary: '#059669',
  buttonPrimary: '#10b981',
  buttonSecondary: '#059669',
};

const presets = [
  { name: 'Emerald', background: 'white' as BackgroundTheme, primary: '#10b981', secondary: '#059669', buttonPrimary: '#10b981', buttonSecondary: '#059669' },
  { name: 'Ocean', background: 'navy' as BackgroundTheme, primary: '#0ea5e9', secondary: '#0284c7', buttonPrimary: '#0ea5e9', buttonSecondary: '#0284c7' },
  { name: 'Lunar', background: 'lunar' as BackgroundTheme, primary: '#8b5cf6', secondary: '#7c3aed', buttonPrimary: '#8b5cf6', buttonSecondary: '#7c3aed' },
  { name: 'Midnight', background: 'black' as BackgroundTheme, primary: '#6366f1', secondary: '#4f46e5', buttonPrimary: '#6366f1', buttonSecondary: '#4f46e5' },
  { name: 'Rose', background: 'white' as BackgroundTheme, primary: '#f43f5e', secondary: '#e11d48', buttonPrimary: '#f43f5e', buttonSecondary: '#e11d48' },
  { name: 'Amber', background: 'black' as BackgroundTheme, primary: '#f59e0b', secondary: '#d97706', buttonPrimary: '#f59e0b', buttonSecondary: '#d97706' },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('themeConfig');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem('themeConfig', JSON.stringify(config));
    applyTheme(config);
  }, [config]);

  const applyTheme = (cfg: ThemeConfig) => {
    const root = document.documentElement;
    root.setAttribute('data-bg', cfg.background);
    root.style.setProperty('--theme-primary', cfg.customPrimary);
    root.style.setProperty('--theme-secondary', cfg.customSecondary);
    root.style.setProperty('--theme-button-primary', cfg.buttonPrimary);
    root.style.setProperty('--theme-button-secondary', cfg.buttonSecondary);
    const primaryHsl = hexToHsl(cfg.customPrimary);
    const secondaryHsl = hexToHsl(cfg.customSecondary);
    root.style.setProperty('--primary', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
    root.style.setProperty('--secondary', `${secondaryHsl.h} ${secondaryHsl.s}% ${secondaryHsl.l}%`);
  };

  const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 142, s: 76, l: 36 };
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const setBackground = (bg: BackgroundTheme) => setConfig(prev => ({ ...prev, background: bg }));
  const setCustomColors = (primary: string, secondary: string) => setConfig(prev => ({ ...prev, customPrimary: primary, customSecondary: secondary, background: 'custom' }));
  const setButtonColors = (primary: string, secondary: string) => setConfig(prev => ({ ...prev, buttonPrimary: primary, buttonSecondary: secondary }));
  const resetTheme = () => setConfig(defaultConfig);

  return (
    <ThemeContext.Provider value={{ config, setBackground, setCustomColors, setButtonColors, resetTheme, presets }}>
      {children}
    </ThemeContext.Provider>
  );
};