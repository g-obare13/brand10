import * as React from "react"

export type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}


const ThemeProviderContext =
  React.createContext<ThemeProviderState | undefined>(undefined)

/**
 * Context provider for managing the application's color theme (light, dark, or system).
 * Persists the user's preference to localStorage and updates the document root classes and color-scheme.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - Child components to wrap.
 * @param {Theme} [props.defaultTheme="light"] - The theme to use if no preference is stored.
 * @param {string} [props.storageKey="ui-theme"] - The localStorage key to use for persistence.
 * @returns {React.ReactElement} The theme provider wrapper.
 */
export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme
    }
    return defaultTheme
  })

  React.useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      root.style.colorScheme = systemTheme
      return
    }

    root.classList.add(theme)
    root.style.colorScheme = theme
  }, [theme])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (nextTheme: Theme) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, nextTheme)
        }
        setTheme(nextTheme)
      },
    }),
    [theme, storageKey]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

/**
 * Custom hook to access and update the current theme.
 * Must be used within a {@link ThemeProvider}.
 *
 * @returns {ThemeProviderState} The current theme and a function to update it.
 * @throws {Error} If used outside of a ThemeProvider.
 */
export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
