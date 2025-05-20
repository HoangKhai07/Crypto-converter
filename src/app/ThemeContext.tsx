'use client'

import React, { createContext, useState, useEffect, ReactNode } from "react";

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check theme 
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as Theme || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Update class 
    if(!mounted) return

    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light';
    }

    localStorage.setItem('theme', theme)

    console.log('Theme change to: ', theme)
  }, [theme, mounted]);

  const toggleTheme = () => {
    console.log('Current theme: ', theme)
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}