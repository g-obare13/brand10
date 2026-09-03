"use client"

import * as React from "react"
import { Facebook, Link, Linkedin, TwitterX } from "@boxicons/react"
import { Button } from "./button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"
import { cn } from "@/lib/utils"

export interface ShareButtonsProps {
  title?: string
  url?: string
  className?: string
  layout?: "row" | "column"
}

export function ShareButtons({
  title = "",
  url = "",
  className = "",
  layout = "row",
}: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false)

  const getUrl = () => {
    if (url) return url
    if (typeof window !== "undefined") return window.location.href
    return ""
  }

  const getTitle = () => {
    if (title) return title
    if (typeof window !== "undefined") return document.title
    return ""
  }

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault()
    const activeUrl = getUrl()
    navigator.clipboard.writeText(activeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareData = [
    {
      label: copied ? "Copied!" : "Copy Link",
      icon: <Link className="h-4 w-4" />,
      onClick: handleCopyLink,
    },
    {
      label: "Share on LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      onClick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`,
          "_blank",
          "noopener,noreferrer"
        )
      },
    },
    {
      label: "Share on X",
      icon: <TwitterX className="h-4 w-4" />,
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(getTitle())}&url=${encodeURIComponent(getUrl())}`,
          "_blank",
          "noopener,noreferrer"
        )
      },
    },
    {
      label: "Share on Facebook",
      icon: <Facebook className="h-4 w-4" />,
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
          "_blank",
          "noopener,noreferrer"
        )
      },
    },
  ]

  return (
    <TooltipProvider delay={100}>
      <div
        className={cn(
          "flex gap-3",
          layout === "column" ? "flex-row lg:flex-col" : "flex-row",
          className
        )}
      >
        {shareData.map((item, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={item.onClick}
                className="cursor-pointer rounded-full hover:text-foreground"
                aria-label={item.label}
              >
                {item.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
export default ShareButtons
