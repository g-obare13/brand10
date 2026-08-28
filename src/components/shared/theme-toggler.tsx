import {  clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Moon, Sun } from "@boxicons/react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"
import type {ClassValue} from "clsx";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

/**
 * A toggle component to switch between light and dark themes.
 * Renders two icons (Sun and Moon) as buttons within a pill-shaped container.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes for the toggle container.
 * @returns {React.ReactElement} The rendered theme toggler.
 */
export function ThemeToggler({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full bg-muted/50 p-1 border border-border/50",
        className
      )}
    >
      <Button
        onClick={() => setTheme("light")}
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 rounded-full transition-all duration-200",
          theme === "light"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
        aria-label="Light Theme"
      >
        <Sun className="h-4 w-4" />
      </Button>

      <Button
        onClick={() => setTheme("dark")}
        variant="ghost"
        size="icon"
        className={cn(
          "h-7 w-7 rounded-full transition-all duration-200",
          theme === "dark"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
        aria-label="Dark Theme"
      >
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  )
}
