import { createContext, useContext } from 'react'

type Theme = 'light' | 'dark'

type ThemeOrigin = {
  x: number
  y: number
}

type ThemeContextValue = {
  isTransitioning: boolean
  theme: Theme
  toggleTheme: (origin?: ThemeOrigin) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider.')
  }

  return context
}

export { ThemeContext, useTheme }
export type { Theme, ThemeContextValue, ThemeOrigin }
