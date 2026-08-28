"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Label({
  className,
  children,
  ...props
}: React.ComponentProps<"label">) {
  const { dangerouslySetInnerHTML, ...cleanProps } = props as any
  return (
    <label
      data-slot="label"
      className={cn(
        "gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
        className
      )}
      {...cleanProps}
    >
      {children}
    </label>
  )
}

export { Label }
