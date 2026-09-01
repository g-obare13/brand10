import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-8 w-fit shrink-0 items-stretch overflow-hidden rounded-full border text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default:
          "border-primary-500/40 bg-primary-100 text-primary dark:border-primary-900/50 dark:bg-primary-950/50 dark:text-primary-300",
        secondary:
          "border-blue-500/40 bg-blue-100 text-blue-600 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300",
        destructive:
          "border-red-500/40 bg-red-100 text-red-600 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300",
        success:
          "border-green-500/40 bg-green-100 text-green-600 dark:border-green-900/50 dark:bg-green-950/50 dark:text-green-300",
        outline:
          "border-border bg-background text-foreground hover:bg-muted/60 dark:border-border dark:bg-card dark:text-foreground",
        ghost:
          "border-transparent hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "border-transparent text-primary underline underline-offset-4 hover:underline",
        warning:
          "border-amber-500/40 bg-amber-100 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type IconPosition = "left" | "right"

interface BadgeProps
  extends useRender.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  iconPosition?: IconPosition
  /** Show the divider line between label and icon. Only applies when icon is passed. */
  showDivider?: boolean
}

function Badge({
  className,
  variant = "default",
  render,
  icon,
  iconPosition = "right",
  showDivider = true,
  children,
  ...props
}: BadgeProps) {
  const iconBlock = icon ? (
    <span
      data-icon={iconPosition === "left" ? "inline-start" : "inline-end"}
      className={cn(
        "flex items-center justify-center self-stretch px-2 [&>svg]:pointer-events-none [&>svg]:size-3.5",
        showDivider &&
          (iconPosition === "left"
            ? "border-r border-border"
            : "border-l border-border")
      )}
    >
      {icon}
    </span>
  ) : null

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ className, variant })),
      },
      {
        children: (
          <>
            {iconPosition === "left" && iconBlock}
            <span className="flex items-center gap-1.5 self-stretch px-2.5">
              {children}
            </span>
            {iconPosition === "right" && iconBlock}
          </>
        ),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
export type { BadgeProps, IconPosition }
