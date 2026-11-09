import { createContext, useContext } from 'react';

export type NeonTheme = 'spectrum' | 'blue' | 'lime' | 'gold';

export const NeonThemeContext = createContext<{
  theme: NeonTheme;
  setTheme: (theme: NeonTheme) => void;
} | null>(null);

export function useNeonTheme() {
  return useContext(NeonThemeContext);
}
