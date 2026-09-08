import { NoiseTexture } from "@/components/shared/NoiseTexture"
import { Button } from "@/components/ui/button"
import { Loader } from "@/components/ui/loader"
import { animateFadeUp } from "@/lib/gsap-animations"
import { useAuthStore } from "@/store/authStore"
import { IconX } from "@tabler/icons-react"
import gsap from "gsap"
import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

export interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef?: React.RefObject<HTMLElement | null>
}

/**
 * Header flyout card allowing OAuth login with Google.
 * Features:
 * - Full-page backdrop blur overlay upon opening.
 * - Ultra-refined frosted glassmorphism with specular highlights and noise texture.
 * - Toned-down, atmospheric ambient lighting aura.
 * - Staggered entrance animation for modal contents.
 *
 * @component
 * @param {LoginModalProps} props - Component props.
 * @returns {React.ReactElement} The rendered flyout card and backdrop portal.
 */
export const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onOpenChange,
  triggerRef,
}) => {
  const auth = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const prevOpenRef = useRef<boolean>(false)

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)
    const { error: googleError } = await auth.signInWithGoogle()
    if (googleError) {
      setError(googleError.message)
      setLoading(false)
    }
  }

  // Client-only portal initialization
  useEffect(() => {
    setIsClient(true)
  }, [])

  // If user signs in while modal is open, direct to dashboard/projects
  useEffect(() => {
    if (auth.user && open) {
      onOpenChange(false)
      window.location.href = "/dashboard/projects"
    }
  }, [auth.user, open, onOpenChange])

  // Animate card & backdrop in / out synchronously
  useEffect(() => {
    if (!isClient) return
    if (prevOpenRef.current === open) return
    prevOpenRef.current = open

    const card = cardRef.current
    const backdrop = backdropRef.current
    if (!card) return

    const animItems = card.querySelectorAll(".login-anim-item")

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
          variant={"outline"}
        >
          <IconX size={16} />
        </Button>

        {/* Modal Content */}
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          {/* Heading */}
          <h5 className="login-anim-item opacity-0">Sign in to Brand Studio</h5>

          {/* Description */}
          <p className="login-anim-item max-w-xs text-center text-foreground opacity-0">
            Authenticate with your Google account to manage your system.
          </p>

          <div className="w-full space-y-4 pt-2">
            {error && (
              <div className="login-anim-item rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-center text-xs text-destructive opacity-0">
                {error}
              </div>
            )}

            {/* Primary Action: Google Authentication */}
            <div className="login-anim-item space-y-2.5 opacity-0">
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                gsapFill
                icon={
                  loading ? (
                    <Loader size="sm" />
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 269 274"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0"
                    >
                      <g clipPath="url(#clip0_google_flyout)">
                        <mask
                          id="mask0_google_flyout"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="269"
                          height="274"
                        >
                          <path
                            d="M265.577 111.535H136.932V164.185H210.852C209.664 171.636 206.996 178.966 203.088 185.65C198.612 193.308 193.077 199.138 187.404 203.577C170.412 216.877 150.601 219.596 136.842 219.596C102.087 219.596 72.3903 196.653 60.8942 165.477C60.4302 164.346 60.1222 163.177 59.747 162.022C57.2066 154.088 55.8186 145.684 55.8186 136.95C55.8186 127.86 57.3217 119.159 60.0623 110.941C70.8725 78.5291 101.238 54.3208 136.867 54.3208C144.034 54.3208 150.935 55.192 157.479 56.9298C172.436 60.9013 183.015 68.7231 189.498 74.9101L228.614 35.7846C204.82 13.502 173.802 3.36896e-08 136.802 3.36896e-08C107.223 -0.000650235 79.9149 9.41222 57.5365 25.3203C39.3883 38.2213 24.5042 55.4941 14.4593 75.5546C5.11602 94.1547 0 114.767 0 136.929C0 159.093 5.12384 179.919 14.4671 198.348V198.472C24.3359 218.036 38.7675 234.881 56.3075 247.723C71.6306 258.941 99.1064 273.883 136.802 273.883C158.48 273.883 177.693 269.891 194.637 262.41C206.86 257.013 217.69 249.974 227.495 240.928C240.45 228.974 250.597 214.189 257.522 197.178C264.448 180.167 268.152 160.931 268.152 140.076C268.152 130.363 267.197 120.499 265.577 111.535V111.535Z"
                            fill="white"
                          />
                        </mask>
                        <g mask="url(#mask0_google_flyout)">
                          <g filter="url(#filter0_google_flyout)">
                            <path
                              d="M-1.97314 137.859C-1.83095 159.673 4.25469 182.179 13.4663 200.348V200.473C20.1222 213.667 29.2188 224.09 39.5797 234.417L102.157 211.096C90.3176 204.953 88.5111 201.189 80.0243 194.321C71.3515 185.389 64.8877 175.135 60.8622 163.111H60.7L60.8622 162.986C58.2139 155.046 57.9527 146.618 57.855 137.859H-1.97314Z"
                              fill="url(#paint0_radial_google_flyout)"
                            />
                          </g>
                          <g filter="url(#filter1_google_flyout)">
                            <path
                              d="M136.933 -0.996063C130.748 21.1975 133.113 42.7703 136.933 55.3224C144.076 55.3278 150.956 56.1974 157.48 57.9298C172.437 61.9012 183.015 69.7233 189.498 75.9103L229.615 35.7852C205.849 13.5292 177.249 -0.960998 136.933 -0.996063Z"
                              fill="url(#paint1_radial_google_flyout)"
                            />
                          </g>
                          <g filter="url(#filter2_google_flyout)">
                            <path
                              d="M136.799 -1.17157C106.461 -1.17224 78.4512 8.48229 55.4984 24.7988C46.9759 30.8571 39.1551 37.8555 32.1911 45.6378C30.3667 63.1191 45.8481 84.6053 76.506 84.4275C91.381 66.7547 113.381 55.3204 137.867 55.3204C137.889 55.3204 137.911 55.3223 137.933 55.3224L136.933 -1.16757C136.888 -1.1676 136.844 -1.17157 136.799 -1.17157Z"
                              fill="url(#paint2_radial_google_flyout)"
                            />
                          </g>
                          <g filter="url(#filter3_google_flyout)">
                            <path
                              d="M236.932 144.185L209.853 163.186C208.665 170.637 205.995 177.967 202.087 184.65C197.611 192.308 192.076 198.138 186.404 202.578C169.446 215.85 149.688 218.582 135.933 218.594C121.716 243.325 119.224 255.713 136.933 275.674C158.847 275.657 178.274 271.617 195.41 264.051C207.797 258.582 218.772 251.448 228.708 242.28C241.838 230.167 252.122 215.183 259.14 197.944C266.159 180.705 269.912 161.211 269.912 140.076L236.932 144.185Z"
                              fill="url(#paint3_radial_google_flyout)"
                            />
                          </g>
                          <g filter="url(#filter4_google_flyout)">
                            <path
                              d="M134.933 109.535V166.186H265.216C266.362 158.427 270.152 148.388 270.152 140.076C270.152 130.364 269.198 118.5 267.578 109.535H134.933Z"
                              fill="#3086FF"
                            />
                          </g>
                          <g filter="url(#filter5_google_flyout)">
                            <path
                              d="M32.8126 43.6378C24.7728 52.6225 17.9043 62.6789 12.4584 73.5547C3.1153 92.1549 -2.00049 114.767 -2.00049 136.93C-2.00049 137.242 -1.97518 137.548 -1.97314 137.859C2.16463 145.963 55.1827 144.411 57.855 137.859C57.8516 137.554 57.8179 137.256 57.8179 136.949C57.8179 127.859 59.3215 121.159 62.0621 112.941C65.443 102.805 70.7368 93.47 77.506 85.4274C79.0405 83.4265 83.1336 79.1249 84.3278 76.5447C84.7827 75.5619 83.5019 75.0102 83.4303 74.6643C83.3502 74.2774 81.633 74.5885 81.2483 74.3004C80.0269 73.3853 77.6081 72.9074 76.1393 72.4827C73 71.5748 67.7973 69.5726 64.9075 67.4972C55.7731 60.9368 41.5179 53.1004 32.8126 43.6378Z"
                              fill="url(#paint4_radial_google_flyout)"
                            />
                          </g>
                          <g filter="url(#filter6_google_flyout)">
                            <path
                              d="M65.1037 74.703C86.2855 87.8082 92.377 68.0881 106.46 61.9173L81.9622 10.0297C72.9506 13.8982 64.4364 18.7045 56.5365 24.3202C44.7387 32.7069 34.3204 42.9411 25.7141 54.5877L65.1037 74.703Z"
                              fill="url(#paint5_radial_google_flyout)"
                            />
                          </g>
                          <g filter="url(#filter7_google_flyout)">
                            <path
                              d="M73.7247 207.087C45.2908 217.571 40.8394 217.947 38.222 235.945C43.2236 240.93 48.5975 245.542 54.308 249.723C69.6312 260.941 99.1062 275.883 136.802 275.883C136.846 275.883 136.889 275.879 136.933 275.879V217.594C136.904 217.594 136.872 217.596 136.843 217.596C122.727 217.596 111.447 213.809 99.882 207.224C97.0304 205.6 91.857 209.96 89.2271 208.011C85.5999 205.323 76.8707 210.327 73.7247 207.087Z"
                              fill="url(#paint6_radial_google_flyout)"
                            />
                          </g>
                        </g>
                      </g>
                      <defs>
                        <filter
                          id="filter0_google_flyout"
                          x="-2.44322"
                          y="137.389"
                          width="105.07"
                          height="97.4972"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feGaussianBlur
                            stdDeviation="0.23504"
                            result="effect1_foregroundBlur"
                          />
                        </filter>
                        <filter
                          id="filter1_google_flyout"
                          x="132.66"
                          y="-1.46614"
                          width="97.4248"
                          height="77.8465"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feGaussianBlur
                            stdDeviation="0.23504"
                            result="effect1_foregroundBlur"
                          />
                        </filter>
                        <filter
                          id="filter2_google_flyout"
                          x="31.5764"
                          y="-1.64165"
                          width="106.827"
                          height="86.5403"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feGaussianBlur
                            stdDeviation="0.23504"
                            result="effect1_foregroundBlur"
                          />
                        </filter>
                        <filter
                          id="filter3_google_flyout"
                          x="123.984"
                          y="139.606"
                          width="146.398"
                          height="136.538"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feGaussianBlur
                            stdDeviation="0.23504"
                            result="effect1_foregroundBlur"
                          />
                        </filter>
                        <filter
                          id="filter4_google_flyout"
                          x="134.463"
                          y="109.065"
                          width="136.159"
                          height="57.5904"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feGaussianBlur
                            stdDeviation="0.23504"
                            result="effect1_foregroundBlur"
                          />
                        </filter>
                        <filter
                          id="filter5_google_flyout"
                          x="-2.47057"
                          y="43.1678"
                          width="87.3659"
                          height="100.673"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feGaussianBlur
                            stdDeviation="0.23504"
                            result="effect1_foregroundBlur"
                          />
                        </filter>
                        <filter
                          id="filter6_google_flyout"
                          x="22.4093"
                          y="6.72484"
                          width="87.3557"
                          height="75.6876"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feGaussianBlur
                            stdDeviation="1.65243"
                            result="effect1_foregroundBlur"
                          />
                        </filter>
                        <filter
                          id="filter7_google_flyout"
                          x="37.752"
                          y="206.383"
                          width="99.6511"
                          height="69.9696"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                          />
                          <feGaussianBlur
                            stdDeviation="0.23504"
                            result="effect1_foregroundBlur"
                          />
                        </filter>
                        <radialGradient
                          id="paint0_radial_google_flyout"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(100.904 232.362) rotate(-92.3395) scale(136.506 200.511)"
                        >
                          <stop offset="0.141612" stopColor="#1ABD4D" />
                          <stop offset="0.247515" stopColor="#6EC30D" />
                          <stop offset="0.311547" stopColor="#8AC502" />
                          <stop offset="0.366013" stopColor="#A2C600" />
                          <stop offset="0.445673" stopColor="#C8C903" />
                          <stop offset="0.540305" stopColor="#EBCB03" />
                          <stop offset="0.615636" stopColor="#F7CD07" />
                          <stop offset="0.699345" stopColor="#FDCD04" />
                          <stop offset="0.771242" stopColor="#FDCE05" />
                          <stop offset="0.860566" stopColor="#FFCE0A" />
                        </radialGradient>
                        <radialGradient
                          id="paint1_radial_google_flyout"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientTransform="matrix(94.6317 -0.000232294 -0.000133009 122.212 225.862 73.007)"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.408458" stopColor="#FB4E5A" />
                          <stop offset="1" stopColor="#FF4540" />
                        </radialGradient>
                        <radialGradient
                          id="paint2_radial_google_flyout"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(174.183 -18.8621) rotate(151.02) scale(151.564 205.671)"
                        >
                          <stop offset="0.231273" stopColor="#FF4541" />
                          <stop offset="0.311547" stopColor="#FF4540" />
                          <stop offset="0.457516" stopColor="#FF4640" />
                          <stop offset="0.540305" stopColor="#FF473F" />
                          <stop offset="0.699346" stopColor="#FF5138" />
                          <stop offset="0.771242" stopColor="#FF5B33" />
                          <stop offset="0.860566" stopColor="#FF6C29" />
                          <stop offset="1" stopColor="#FF8C18" />
                        </radialGradient>
                        <radialGradient
                          id="paint3_radial_google_flyout"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(138.904 257.948) rotate(-127.454) scale(395.392 145.949)"
                        >
                          <stop offset="0.131546" stopColor="#0CBA65" />
                          <stop offset="0.209784" stopColor="#0BB86D" />
                          <stop offset="0.297297" stopColor="#09B479" />
                          <stop offset="0.396257" stopColor="#08AD93" />
                          <stop offset="0.477124" stopColor="#0AA6A9" />
                          <stop offset="0.568425" stopColor="#0D9CC6" />
                          <stop offset="0.667385" stopColor="#1893DD" />
                          <stop offset="0.768727" stopColor="#258BF1" />
                          <stop offset="0.858506" stopColor="#3086FF" />
                        </radialGradient>
                        <radialGradient
                          id="paint4_radial_google_flyout"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(125.183 24.6958) rotate(96.6178) scale(147.65 204.152)"
                        >
                          <stop offset="0.366013" stopColor="#FF4E3A" />
                          <stop offset="0.457516" stopColor="#FF8A1B" />
                          <stop offset="0.540305" stopColor="#FFA312" />
                          <stop offset="0.615636" stopColor="#FFB60C" />
                          <stop offset="0.771242" stopColor="#FFCD0A" />
                          <stop offset="0.860566" stopColor="#FECF0A" />
                          <stop offset="0.915033" stopColor="#FECF08" />
                          <stop offset="1" stopColor="#FDCD01" />
                        </radialGradient>
                        <radialGradient
                          id="paint5_radial_google_flyout"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(101.254 23.1744) rotate(132.119) scale(73.3365 206.849)"
                        >
                          <stop offset="0.315904" stopColor="#FF4C3C" />
                          <stop offset="0.603818" stopColor="#FF692C" />
                          <stop offset="0.726837" stopColor="#FF7825" />
                          <stop offset="0.884534" stopColor="#FF8D1B" />
                          <stop offset="1" stopColor="#FF9F13" />
                        </radialGradient>
                        <radialGradient
                          id="paint6_radial_google_flyout"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(174.183 292.741) rotate(-151.02) scale(151.564 205.671)"
                        >
                          <stop offset="0.231273" stopColor="#0FBC5F" />
                          <stop offset="0.311547" stopColor="#0FBC5F" />
                          <stop offset="0.366013" stopColor="#0FBC5E" />
                          <stop offset="0.457516" stopColor="#0FBC5D" />
                          <stop offset="0.540305" stopColor="#12BC58" />
                          <stop offset="0.699346" stopColor="#28BF3C" />
                          <stop offset="0.771242" stopColor="#38C02B" />
                          <stop offset="0.860566" stopColor="#52C218" />
                          <stop offset="0.915033" stopColor="#67C30F" />
                          <stop offset="1" stopColor="#86C504" />
                        </radialGradient>
                        <clipPath id="clip0_google_flyout">
                          <rect width="268.152" height="273.883" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  )
                }
                variant={"outline"}
                size={"pill"}
                className={"w-full cursor-pointer rounded-full"}
              >
                {loading ? "Connecting to Google..." : "Continue with Google"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
