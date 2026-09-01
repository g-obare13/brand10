import { Logo } from "@/components/shared/Logo"
import { LoginModal } from "@/components/shared/LoginModal"
import { ThemeToggler } from "@/components/shared/theme-toggler"
import AnimatedUnderline from "@/components/ui/animated-underline"
import { Button } from "@/components/ui/button"
import { headerData } from "@/data/menu"
import { animateFadeUp } from "@/lib/gsap-animations"
import { useAuthStore } from "@/store/authStore"
import {
  IconLock,
  IconLogout,
  IconMenu,
  IconMessageCircle,
  IconX,
} from "@tabler/icons-react"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import GlassPanel from "./GlassPanel"
import Container from "../ui/container"

export interface HeaderProps {
  action?: "default" | "logout"
}

/**
 * Agency site header with navigation menu.
 * Includes a logo link, chat button, and a toggleable full-screen menu panel
 * with animated navigation links and detail items using GSAP.
 */
export function Header({ action }: HeaderProps = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const { user, initialize, signOut } = useAuthStore()
  const menuRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

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
              className="rounded-full p-1"
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
                  className="hidden cursor-pointer rounded-full p-6 lg:flex"
                  icon={<IconLogout size={16} />}
                  onClick={async () => {
                    await signOut()
                    navigate({ to: "/auth/login" })
                  }}
                  iconPlacement="right"
                >
                  Sign Out
                </Button>
              ) : user ? (
                <Button
                  gsapFill
                  variant="outline"
                  className="hidden cursor-pointer rounded-full p-6 lg:flex"
                  icon={<IconLock size={16} />}
                  href="/dashboard/projects"
                  iconPlacement="right"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  gsapFill
                  variant="outline"
                  className="hidden cursor-pointer rounded-full p-6 lg:flex"
                  icon={<IconLock size={16} />}
                  onClick={() => setLoginModalOpen(true)}
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
              className="btn-fill rounded-full p-6"
              icon={isOpen ? <IconX size={16} /> : <IconMenu size={16} />}
              iconPlacement="right"
              onClick={() => setIsOpen(!isOpen)}
            >
              {headerData.menuLabel}
            </Button>
          </div>

          {/* Menu Panel */}
          <div
            ref={menuRef}
            className="shadow-custom absolute top-[calc(100%+0.5rem)] right-0 hidden w-[90vw] rounded-3xl border bg-popover p-6 text-popover-foreground sm:w-[440px] sm:p-8 md:w-[480px] lg:w-[540px] lg:p-10"
          >
            <div className="flex flex-col gap-10">
              <nav className="flex flex-col gap-3">
                {headerData.menuLinks.map((link) => {
                  const isActive =
                    currentPath === link.href ||
                    (link.href !== "/" && currentPath.startsWith(link.href))
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className="menu-nav-link block w-fit py-1 text-foreground no-underline opacity-0"
                    >
                      <AnimatedUnderline active={isActive}>
                        <h6> {link.label}</h6>
                      </AnimatedUnderline>
                    </Link>
                  )
                })}
              </nav>

              <div className="grid grid-cols-2 gap-8 border-t border-muted/20 text-base">
                {headerData.menuDetails.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <h6 className="menu-detail-item font-medium text-foreground opacity-0">
                      {item.label}
                    </h6>
                    <div className="menu-detail-item font-medium opacity-0">
                      <div className="flex flex-col items-start gap-1">
                        {item.items.map((link) => (
                          <Link
                            key={link.text}
                            to={link.href}
                            target={
                              link.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              link.href.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="text-base! font-semibold! text-foreground no-underline"
                          >
                            <AnimatedUnderline>{link.text}</AnimatedUnderline>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      </Container>
    </header>
  )
}

export default Header
