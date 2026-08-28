/**
 * Container Component
 *
 * A flexible wrapper component that provides consistent layout constraints and responsive padding.
 * Centers content horizontally and applies maximum width limits for better readability.
 * Can render as different semantic HTML elements for better accessibility and SEO.
 *
 * @example
 * // Basic usage
 * <Container>
 *   <h1>My Content</h1>
 * </Container>
 *
 * @example
 * // With custom styling and semantic element
 * <Container as="section" className="py-8" role="main">
 *   <p>Section content</p>
 * </Container>
 */

// Import React utilities
import type { PropsWithChildren } from "react"; // Type for components that accept children

// Import utility function for conditional class names
import { cn } from "@/lib/utils"; // Utility for combining CSS classes

/**
 * Type definition for semantic HTML elements that the Container can render as
 * These elements provide better semantic meaning for screen readers and SEO
 */
type SemanticElement =
  | "div"
  | "section"
  | "main"
  | "article"
  | "aside"
  | "nav"
  | "header"
  | "footer"
  | "form";

/**
 * Props interface for the Container component
 * Extends PropsWithChildren to include the children prop automatically
 */
interface ContainerProps extends PropsWithChildren {
  className?: string; // Additional CSS classes to apply
  as?: SemanticElement; // HTML element to render as (defaults to 'div')
  role?: string; // ARIA role for accessibility
  suppressHydrationWarning?: boolean; // Suppress hydration warnings
}

/**
 * Container component that wraps content with consistent layout constraints
 *
 * @param children - The content to be wrapped (React nodes)
 * @param className - Additional CSS classes to merge with default styles
 * @param as - The HTML element to render as (defaults to 'div')
 * @param role - ARIA role attribute for accessibility
 * @returns JSX element with constrained layout
 */
const Container = ({
  children = null,
  className = "",
  as: Component = "div",
  role,
  suppressHydrationWarning,
  ...props
}: ContainerProps) => {
  // Early return if no children are provided
  if (!children) return null;

  return (
    <Component
      className={cn(
        "max-w-screen lg:max-w-[95vw] mx-auto px-4 lg:px-8", // Default responsive styles
        className, // Additional custom classes
      )}
      role={role} // ARIA role for accessibility
      {...(suppressHydrationWarning ? { suppressHydrationWarning } : {})}
      {...props}
    >
      {children}
    </Component>
  );
};

// Export the component as default
export default Container;
