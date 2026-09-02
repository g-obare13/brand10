import { LoginModal } from "@/components/shared/LoginModal"
import { Logo } from "@/components/shared/Logo"
import { ThemeToggler } from "@/components/shared/theme-toggler"
import { Button } from "@/components/ui/button"
import { headerData } from "@/data/menu"
import { animateFadeUp } from "@/lib/gsap-animations"
import { useAuthStore } from "@/store/authStore"
import {
  IconCheck,
  IconCopy,
  IconLock,
  IconLogout,
  IconMenu,
  IconX,
} from "@tabler/icons-react"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import Container from "@/components/ui/container"
import GlassPanel from "./GlassPanel"
import ImageComponentOptimized from "./ImageComponentOptimized"

export interface HeaderProps {
  action?: "default" | "logout"
}

/**
 * Primary agency application header with sticky navigation and mobile drawer.
 * Features:
 * - Brand logo link to home / projects.
 * - Authentication state trigger (Login modal or Logout action).
 * - ThemeToggler button switching light and dark modes.
 * - Fullscreen responsive overlay menu with GSAP staggered animations.
 *
 * @component
 * @param {HeaderProps} [props] - The component props.
 * @param {"default" | "logout"} [props.action] - Override action type for the auth action button.
 * @returns {React.ReactElement} The rendered global header.
 */
export function Header({ action }: HeaderProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { user, initialize, signOut } = useAuthStore()
  const menuRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const getStartedBtnRef = useRef<HTMLButtonElement>(null)

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldId)
    setTimeout(() => {
      setCopiedField((curr) => (curr === fieldId ? null : curr))
    }, 2000)
  }

  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname
  const isDashboard =
    action === "logout" || currentPath === "/dashboard/projects"

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (isOpen) {
      // Animate container in
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, x: 40, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          display: "block",
        }
      )

      // Animate navigation links
      const navLinks = menuRef.current?.querySelectorAll(".menu-nav-link")
      if (navLinks && navLinks.length > 0) {
        animateFadeUp(Array.from(navLinks), {
          y: 25,
          duration: 0.45,
          stagger: 0.07,
          ease: "power2.out",
          delay: 0.1,
        })
      }

      // Animate detail items
      const detailItems = menuRef.current?.querySelectorAll(".menu-detail-item")
      if (detailItems && detailItems.length > 0) {
        animateFadeUp(Array.from(detailItems), {
          y: 15,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.3,
        })
      }
    } else {
      // Animate out
      gsap.to(menuRef.current, {
        opacity: 0,
        x: 30,
        scale: 0.95,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(menuRef.current, { display: "none" })
        },
      })
    }
  }, [isOpen])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-50 py-4 lg:py-8">
      <Container className="pointer-events-none flex w-full items-center justify-between">
        {/* Left: Logo Pill in GlassPanel */}
        <div className="pointer-events-auto">
          <GlassPanel
            blur="none"
            noise
            noiseOpacity={0.02}
            className="flex h-fit items-center justify-center rounded-full bg-card px-5 py-3 shadow-xs"
          >
            <Link
              to="/"
              className="flex cursor-pointer items-center text-foreground no-underline transition-opacity hover:opacity-85"
            >
              <Logo className="h-6 w-auto" />
            </Link>
          </GlassPanel>
        </div>

        {/* Right: Controls & Flyout Menu */}
        <div className="pointer-events-auto relative">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Switch */}
            <GlassPanel
              blur="none"
              noise
              noiseOpacity={0.02}
              className="hidden rounded-full p-1 lg:flex"
            >
              <ThemeToggler />
            </GlassPanel>

            {/* Action / Login Button */}
            <GlassPanel
              blur="none"
              noise
              noiseOpacity={0.02}
              className="rounded-full"
            >
              {isDashboard ? (
                <Button
                  gsapFill
                  variant="outline"
                  className="cursor-pointer rounded-full p-6"
                  icon={<IconLogout size={16} />}
                  onClick={async () => {
                    await signOut()
                    navigate({ to: "/" })
                  }}
                  iconPlacement="right"
                >
                  Sign Out
                </Button>
              ) : user ? (
                <Button
                  gsapFill
                  variant="outline"
                  className="cursor-pointer rounded-full p-6"
                  icon={<IconLock size={16} />}
                  href="/dashboard/projects"
                  iconPlacement="right"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  ref={getStartedBtnRef}
                  gsapFill
                  variant="outline"
                  className="cursor-pointer rounded-full p-6"
                  icon={<IconLock size={16} />}
                  onClick={() => {
                    setIsOpen(false)
                    setLoginModalOpen(!loginModalOpen)
                  }}
                  iconPlacement="right"
                >
                  {headerData.chatLabel}
                </Button>
              )}
            </GlassPanel>

            {/* Menu/Close Button */}
            <Button
              ref={menuBtnRef}
              variant="shiny"
              className="btn-fill hidden rounded-full p-6 lg:flex"
              icon={isOpen ? <IconX size={16} /> : <IconMenu size={16} />}
              iconPlacement="right"
              onClick={() => {
                setLoginModalOpen(false)
                setIsOpen(!isOpen)
              }}
            >
              {headerData.menuLabel}
            </Button>
          </div>

          {/* Contact Card Modal */}
          <div
            ref={menuRef}
            className="absolute top-[calc(100%+0.75rem)] right-0 hidden w-[92vw] overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-6 text-foreground shadow-2xl backdrop-blur-2xl sm:w-[480px] sm:p-8 md:w-[520px] dark:border-white/10 dark:bg-zinc-950/90"
          >
            {/* Ambient Background Gradient following DashboardBackground */}
            <div className="pointer-events-none absolute -top-28 -left-20 h-72 w-72 rounded-full bg-linear-to-br from-indigo-500/20 via-sky-400/20 to-purple-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 -bottom-24 h-72 w-72 rounded-full bg-linear-to-bl from-orange-400/15 via-rose-400/15 to-amber-300/15 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-sky-50/50 via-transparent to-white/40 dark:from-sky-950/20 dark:via-transparent dark:to-zinc-950/40" />

            <div className="relative z-10 flex flex-col gap-5">
              {/* Avatar */}
              <div className="menu-nav-link opacity-0">
                <div className="border/20 relative h-20 w-20 overflow-hidden rounded-full border sm:h-24 sm:w-24">
                  <ImageComponentOptimized
                    src={headerData.contactCard.image}
                    alt={headerData.contactCard.name}
                    className="h-full w-full object-cover"
                    imageClassName="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Name & Headline */}
              <div className="flex flex-col gap-2">
                <h3 className="menu-nav-link text-2xl font-bold tracking-tight text-foreground opacity-0 sm:text-3xl">
                  {headerData.contactCard.name}
                </h3>
                <p className="menu-nav-link text-sm leading-snug font-semibold text-foreground/90 opacity-0 sm:text-base">
                  {headerData.contactCard.role}
                </p>
              </div>

              {/* Bio Description */}
              <p className="menu-nav-link text-xs leading-relaxed text-muted-foreground opacity-0 sm:text-sm">
                {headerData.contactCard.bio}
              </p>

              {/* Contact Pills / Actions */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                {/* Email Pill */}
                <Badge
                  onClick={() =>
                    handleCopy(headerData.contactCard.email, "email")
                  }
                  variant={"outline"}
                  className="menu-detail-item rounded-full"
                  // title="Click to copy email"
                  icon={
                    copiedField === "email" ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <IconCheck size={16} />
                      </span>
                    ) : (
                      <IconCopy
                        size={16}
                        className="text-muted-foreground transition-colors group-hover:text-foreground"
                      />
                    )
                  }
                >
                  <span>{headerData.contactCard.email}</span>
                </Badge>

                {/* Phone Pill */}
                {/* <Badge
                  variant={"outline"}
                  onClick={() =>
                    handleCopy(headerData.contactCard.phone, "phone")
                  }
                  className="menu-detail-item rounded-full"
                  //  title="Click to copy phone number"
                  icon={
                    copiedField === "phone" ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <IconCheck size={16} />
                        <span>Copied</span>
                      </span>
                    ) : (
                      <IconCopy
                        size={16}
                        className="text-muted-foreground transition-colors group-hover:text-foreground"
                      />
                    )
                  }
                >
                  <span>{headerData.contactCard.phone}</span>
                </Badge> */}

                {/* Socials */}
                {headerData.contactCard.socials.map((social) => (
                  <a
                    key={social.text}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-detail-item"
                    // title={`Visit ${social.text}`}
                  >
                    <Badge variant={"outline"} icon={social.icon}>
                      {social.text}
                    </Badge>
                    {/* {social.text.toLowerCase().includes("git") ? (
                     
                    ) : (
                      <IconBrandX
                        size={16}
                        className="text-muted-foreground transition-colors group-hover:text-foreground"
                      />
                    )} */}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Login Flyout Card */}
          <LoginModal
            open={loginModalOpen}
            onOpenChange={setLoginModalOpen}
            triggerRef={getStartedBtnRef}
          />
        </div>
      </Container>
    </header>
  )
}

export default Header
