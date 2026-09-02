import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-transparent bg-clip-padding whitespace-nowrap transition-[color,background-color,border-color,box-shadow,opacity] duration-200 outline-none select-none focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[2px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "overflow-hidden bg-primary text-sm text-primary-foreground hover:bg-primary-600 dark:text-white",
        outline:
          "overflow-hidden border-border bg-background text-foreground shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:text-muted-foreground dark:hover:bg-input/50",
        ghost:
          "overflow-hidden hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "overflow-hidden bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        gradient:
          "overflow-hidden border-transparent bg-transparent hover:bg-transparent",
        shiny: [
          "relative overflow-hidden rounded-md",
          "bg-primary-900",
          "font-semibold text-white",
          // Specific orange glow using your color
          "shadow-[0_6px_16px_0px_rgba(194,65,12,0.4),inset_0_1px_0_0_rgba(255,255,255,0.55),inset_0_2px_4px_0_rgba(255,255,255,0.2)]",
          // Gloss overlay
          "[background-image:linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_55%)]",
          // Inner rim
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55),inset_0_2px_4px_0_rgba(255,255,255,0.2)]",
          // Hover goes to primary-400 (#fb923c), active scales down
          "hover:bg-primary-950 active:scale-[0.97] active:bg-primary-950",
        ].join(" "),
        success_outline:
          "overflow-hidden border-emerald-200 bg-emerald-50/50 text-emerald-700 shadow-xs hover:bg-emerald-100 hover:text-emerald-800 aria-expanded:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300",
        destructive_outline:
          "overflow-hidden border-red-200 bg-red-50/50 text-red-600 shadow-xs hover:bg-red-100 hover:text-red-700 aria-expanded:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300",
        warning_outline:
          "overflow-hidden border-amber-200 bg-amber-50/50 text-amber-700 shadow-xs hover:bg-amber-100 hover:text-amber-800 aria-expanded:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-500 dark:hover:bg-amber-900/30 dark:hover:text-amber-400",
        shinyy:
          "border border-white/10 bg-neutral-900 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),inset_0_-1px_0_0_rgba(0,0,0,0.4)] hover:border-white/20 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),inset_0_-1px_0_0_rgba(0,0,0,0.4)]",
      },
      size: {
        default: "h-9 gap-2 px-3 text-sm font-medium",
        xs: "h-6 gap-1 px-2 text-xs font-medium",
        sm: "h-8 gap-1 px-2.5 text-sm font-medium",
        lg: "h-10 gap-1.5 px-2.5 text-sm font-medium",
        pill: "h-12 gap-2 px-8 text-sm font-medium",
        icon: "size-9 text-sm font-medium",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
