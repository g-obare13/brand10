import { NoiseTexture } from "@/components/shared/NoiseTexture"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { animateFadeUp } from "@/lib/gsap-animations"
import { useAuthStore } from "@/store/authStore"
import { IconX } from "@tabler/icons-react"
import { useNavigate } from "@tanstack/react-router"
import gsap from "gsap"
import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

export interface SignOutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef?: React.RefObject<HTMLElement | null>
}

/**
 * Header flyout card confirming session sign-out.
 * Features:
 * - Positioned exactly as LoginModal under the header action bar.
 * - Full-page backdrop blur overlay upon opening.
 * - Frosted glassmorphism with ambient illumination and noise texture.
 * - Staggered entrance and exit animations.
 *
 * @component
 * @param {SignOutModalProps} props - Component props.
 * @returns {React.ReactElement} The rendered flyout card and backdrop portal.
 */
export const SignOutModal: React.FC<SignOutModalProps> = ({
  open,
  onOpenChange,
  triggerRef,
}) => {
  const auth = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const prevOpenRef = useRef<boolean>(false)

  const handleConfirmSignOut = async () => {
    setLoading(true)
    try {
      await auth.signOut()
      onOpenChange(false)
      navigate({ to: "/" })
    } finally {
      setLoading(false)
    }
  }

  // Client-only portal initialization
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Animate card & backdrop in / out synchronously
  useEffect(() => {
    if (!isClient) return
    if (prevOpenRef.current === open) return
    prevOpenRef.current = open

    const card = cardRef.current
    const backdrop = backdropRef.current
    if (!card) return

    const animItems = card.querySelectorAll(".signout-anim-item")

    // Kill any in-flight animations
    gsap.killTweensOf([card, backdrop, ...Array.from(animItems)])

    if (open) {
      // Fade in blurred background backdrop
      if (backdrop) {
        gsap.set(backdrop, { display: "block" })
        gsap.fromTo(
          backdrop,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
          }
        )
      }

      // Animate flyout card container in
      gsap.fromTo(
        card,
        { opacity: 0, y: -12, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
          display: "block",
        }
      )

      // Animate internal items with staggered fadeUp
      if (animItems.length > 0) {
        gsap.set(animItems, { opacity: 0, y: 16 })
        animateFadeUp(Array.from(animItems), {
          y: 16,
          duration: 0.45,
          stagger: 0.07,
          ease: "power2.out",
          delay: 0.1,
        })
      }
    } else {
      // Animate backdrop out
      if (backdrop) {
        gsap.to(backdrop, {
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(backdrop, { display: "none" })
          },
        })
      }

      // Animate flyout card out
      gsap.to(card, {
        opacity: 0,
        y: -10,
        scale: 0.96,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(card, { display: "none" })
          gsap.set(animItems, { opacity: 0, y: 16 })
        },
      })
    }
  }, [open, isClient])

  // Click outside detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        open &&
        cardRef.current &&
        !cardRef.current.contains(event.target as Node) &&
        (!triggerRef?.current ||
          !triggerRef.current.contains(event.target as Node))
      ) {
        onOpenChange(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, triggerRef, onOpenChange])

  // Escape key detection
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  return (
    <>
      {/* Full-screen background blur backdrop portal */}
      {isClient &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={backdropRef}
            aria-hidden="true"
            style={{ display: "none" }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-40 bg-black/35 opacity-0 backdrop-blur-md transition-colors dark:bg-black/60"
          />,
          document.body
        )}

      {/* Floating Glass Flyout Card */}
      <div
        ref={cardRef}
        className="absolute top-[calc(100%+0.75rem)] right-0 z-50 hidden w-[92vw] overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-6 text-foreground shadow-2xl backdrop-blur-2xl sm:w-[420px] sm:p-8 dark:border-white/10 dark:bg-zinc-950/90"
      >
        {/* Subtle, refined ambient illumination */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />

        {/* Subtle organic noise grain */}
        <NoiseTexture
          noiseOpacity={0.02}
          frequency={0.5}
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
        />

        {/* Close Button */}
        <Button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-20 flex size-8 cursor-pointer rounded-full"
          aria-label="Close"
          variant="outline"
        >
          <IconX size={16} />
        </Button>

        {/* Modal Content */}
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          {/* Heading */}
          <h4 className="signout-anim-item opacity-0">
            Sign out of Brand Studio?
          </h4>

          {/* Description */}
          <p className="signout-anim-item max-w-xs text-center text-foreground opacity-0">
            Are you sure you want to end your session? You will be redirected to
            the home page.
          </p>

          <div className="signout-anim-item flex w-full gap-3 pt-3 opacity-0">
            <Button
              type="button"
              variant="outline"
              size="pill"
              gsapFill
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-full"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="pill"
              gsapFill
              onClick={handleConfirmSignOut}
              className="flex-1 rounded-full"
              disabled={loading}
              icon={loading ? <Loader size="sm" /> : undefined}
            >
              {loading ? "Signing Out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
