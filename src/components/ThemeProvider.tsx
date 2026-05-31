import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { useReducedMotion } from 'motion/react'
import { ThemeContext, type Theme, type ThemeOrigin } from './theme'

type ThemeProviderProps = {
  children: ReactNode
}

type ViewTransition = {
  finished: Promise<void>
  ready: Promise<void>
  updateCallbackDone: Promise<void>
}

const THEME_STORAGE_KEY = 'portfolio-theme'
const THEME_TRANSITION_DURATION_MS = 760

function getStoredTheme() {
  if (typeof window === 'undefined') {
    return 'light' as Theme
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme
  }

  return 'light'
}

function getRippleRadius({ x, y }: ThemeOrigin) {
  const distances = [
    Math.hypot(x, y),
    Math.hypot(window.innerWidth - x, y),
    Math.hypot(x, window.innerHeight - y),
    Math.hypot(window.innerWidth - x, window.innerHeight - y),
  ]

  return Math.max(...distances)
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme())
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)

    const themeColor = document.querySelector('meta[name="theme-color"]')

    if (themeColor instanceof HTMLMetaElement) {
      themeColor.content = theme === 'dark' ? '#0f1419' : '#ffffff'
    }
  }, [theme])

  const toggleTheme = useCallback(
    (origin?: ThemeOrigin) => {
      if (isTransitioning) {
        return
      }

      const nextTheme = theme === 'light' ? 'dark' : 'light'
      const root = document.documentElement
      const documentWithTransition = document as Document & {
        startViewTransition?: (updateCallback: () => void | Promise<void>) => ViewTransition
      }

      if (shouldReduceMotion || !origin || !documentWithTransition.startViewTransition) {
        setTheme(nextTheme)
        return
      }

      const endRadius = Math.ceil(getRippleRadius(origin))

      root.style.setProperty('--theme-transition-x', `${origin.x}px`)
      root.style.setProperty('--theme-transition-y', `${origin.y}px`)
      root.style.setProperty('--theme-transition-radius', `${endRadius}px`)
      root.classList.add('theme-transitioning')
      setIsTransitioning(true)

      const transition = documentWithTransition.startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme)
        })
      })

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${origin.x}px ${origin.y}px)`,
                `circle(${endRadius}px at ${origin.x}px ${origin.y}px)`,
              ],
            },
            {
              duration: THEME_TRANSITION_DURATION_MS,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              fill: 'both',
              pseudoElement: '::view-transition-new(root)',
            }
          )
        })
        .catch(() => {
          root.classList.remove('theme-transitioning')
          root.style.removeProperty('--theme-transition-x')
          root.style.removeProperty('--theme-transition-y')
          root.style.removeProperty('--theme-transition-radius')
          setIsTransitioning(false)
        })

      transition.finished.finally(() => {
        root.classList.remove('theme-transitioning')
        root.style.removeProperty('--theme-transition-x')
        root.style.removeProperty('--theme-transition-y')
        root.style.removeProperty('--theme-transition-radius')
        setIsTransitioning(false)
      })
    },
    [isTransitioning, shouldReduceMotion, theme]
  )

  return (
    <ThemeContext.Provider
      value={{
        isTransitioning,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeProvider }
