import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva } from "class-variance-authority"
import type { VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border border-transparent px-2 py-3! text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "rounded-sm! border-primary-500 bg-primary-100 text-xs text-primary-500 dark:border-primary-900/50 dark:bg-primary-950/50 dark:text-primary-300",
        secondary:
          "rounded-sm! border-blue-500 bg-blue-100 text-xs text-blue-500 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300",
        destructive:
          "rounded-sm! border-red-500 bg-red-100 text-xs text-red-500 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300",
        success:
          "rounded-sm! border-green-500 bg-green-100 text-xs text-green-500 dark:border-green-900/50 dark:bg-green-950/50 dark:text-green-300",
        outline:
          "rounded-sm! border-gray-200 bg-gray-100 text-xs text-gray-700 dark:border-gray-900/50 dark:bg-gray-950/50 dark:text-gray-300",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline underline-offset-4 hover:underline",
        warning:
          "rounded-sm! border-amber-500 bg-amber-100 text-xs text-amber-500 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ className, variant })),
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
