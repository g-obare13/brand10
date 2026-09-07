/**
 * @file guidelines.ts
 * @description Master data configurations and comprehensive editorial articles
 * for core brand guidelines: Accessibility, Atomic Design, Color, Components,
 * Foundations, Icons, Imagery, and Typography.
 * Strictly adheres to the structure:
 * - What the guideline is
 * - Key concepts
 * - How to use it
 */

export interface GuidelineBullet {
  label: string
  text: string
}

export interface GuidelineSection {
  title: string
  paragraphs: string[]
  quote?: {
    text: string
    author?: string
  }
  bullets?: GuidelineBullet[]
}

export interface GuidelineTakeaways {
  uxImpact: string
  brandPerception: string
  realWorldRecommendation: string
}

export interface GuidelineArticle {
  id: string
  slug: string
  title: string
  subtitle: string
  author: string
  avatar: string
  date: string
  readTime: string
  category: string
  excerpt: string
  accentColor: string
  sections: {
    whatItIs: GuidelineSection
    keyConcepts: GuidelineSection
    howToUseIt: GuidelineSection
  }
  takeaways: GuidelineTakeaways
}

export interface GuidelineCardSummary {
  id: string
  slug: string
  title: string
  subtitle: string
  category: string
  description: string
  readTime: string
  accentColor: string
}

/**
 * The 8 core design system guidelines organized alphabetically:
 * Accessibility, Atomic Design, Color, Components, Foundations, Icons, Imagery, Typography.
 */
export const GUIDELINE_ARTICLES: GuidelineArticle[] = [
  {
    id: "accessibility",
    slug: "accessibility",
    title: "Accessibility (a11y) & Inclusive Design",
    subtitle: "Universal design standards for cognitive, visual, motor, and auditory parity",
    author: "Obare",
    avatar: "/portfolio/obare.avif",
    date: "18 Aug 2026",
    readTime: "7 min read",
    category: "Design Systems",
    excerpt:
      "Accessibility is not a compliance checklist or an afterthought; it is the deliberate practice of ensuring every human can perceive, understand, navigate, and interact with digital brand experiences regardless of situational, temporary, or permanent ability.",
    accentColor: "#6366f1",
    sections: {
      whatItIs: {
        title: "1. What the Guideline Is",
        paragraphs: [
          "Accessibility (often abbreviated as a11y) is the engineering and design discipline of removing digital barriers so people with varying physical, sensory, and cognitive abilities can experience your product with equal autonomy and dignity.",
          "In modern design systems, accessibility establishes baseline standards for color contrast, typography readability, screen reader announcements, keyboard navigation traps, focus indicators, and touch target minimums.",
          "A brand that fails accessibility communicates organizational negligence. Conversely, treating accessibility as a living design constraint elevates usability for everyone, including aging populations, mobile users under direct sunlight, and individuals experiencing situational impairments.",
        ],
        quote: {
          text: "When an interface is truly accessible, it ceases to call attention to itself and allows human intention to flow effortlessly.",
          author: "W3C Web Accessibility Initiative",
        },
      },
      keyConcepts: {
        title: "2. Key Concepts",
        paragraphs: [
          "The Web Content Accessibility Guidelines (WCAG 2.2) categorize digital parity into four foundational principles: Perceivable, Operable, Understandable, and Robust (POUR).",
        ],
        bullets: [
          {
            label: "Perceivable Contrast",
            text: "All informational text must achieve a minimum 4.5:1 contrast ratio against its background for normal body copy, and 3:1 for large display headings (18pt+) and essential graphical UI boundaries.",
          },
          {
            label: "Operable Modality & Focus Rings",
            text: "Every interactive control must be fully navigable and operable via keyboard alone. Interactive elements must display a distinct, high-contrast visual focus ring that never relies on color changes alone.",
          },
          {
            label: "Semantic Structure & ARIA",
            text: "HTML5 semantic tags (main, nav, article, header, footer) must structure content logically. ARIA roles and labels are applied only when native HTML elements cannot convey meaning.",
          },
          {
            label: "Touch Targets & Spatial Clearance",
            text: "Interactive buttons and links must provide an absolute minimum touch target size of 44x44 CSS pixels (or 48x48dp on mobile devices) with adequate clearance to prevent accidental activations.",
          },
        ],
      },
      howToUseIt: {
        title: "3. How to Use It",
        paragraphs: [
          "Incorporate accessibility tokens and tests at every phase of the product lifecycle:",
          "First, define your color palettes with computed WCAG 2.2 AAA and AA contrast tiers directly in your design token dictionary. Never select colors without verifying contrast ratios across both light and dark themes.",
          "Second, establish keyboard navigation tab orders that mirror visual reading flow. Ensure modal dialogs trap focus while open and restore focus to the triggering element upon dismissal.",
          "Third, mandate descriptive alt text for all informative imagery, while marking purely decorative graphics with aria-hidden='true'. Test all critical customer conversion flows using voiceover screen readers and keyboard navigation.",
        ],
        bullets: [
          {
            label: "Do",
            text: "Provide visible, high-contrast focus rings for all interactive buttons and links.",
          },
          {
            label: "Do",
            text: "Use meaningful button labels like 'Submit Payment' rather than vague 'Click here' or standalone icon buttons.",
          },
          {
            label: "Avoid",
            text: "Relying on color alone to indicate errors, system status, or active selections.",
          },
          {
            label: "Avoid",
            text: "Suppressing outline styles with 'outline: none' without supplying an immediate accessible alternative.",
          },
        ],
      },
    },
    takeaways: {
      uxImpact:
        "Guarantees seamless access for the 15% of the global population experiencing disabilities while drastically reducing bounce rates for all users in high-glare or mobile environments.",
      brandPerception:
        "Signals inclusive institutional maturity, empathy, and regulatory compliance, shielding the brand from legal liability and social backlash.",
      realWorldRecommendation:
        "Automate accessibility testing in CI/CD pipelines using axe-core or Lighthouse, and conduct quarterly usability reviews with assistive technology users.",
    },
  },
  {
    id: "atomic-design",
    slug: "atomic-design",
    title: "Atomic Design Architecture & Methodology",
    subtitle: "Hierarchical component methodology for scalable living design systems",
    author: "Obare",
    avatar: "/portfolio/obare.avif",
    date: "19 Aug 2026",
    readTime: "8 min read",
    category: "Architecture",
    excerpt:
      "Atomic Design provides a mental model for constructing user interfaces out of modular, reusable components. By breaking systems down into Atoms, Molecules, Organisms, Templates, and Pages, teams construct unified software architectures that scale without fragmentation.",
    accentColor: "#ec4899",
    sections: {
      whatItIs: {
        title: "1. What the Guideline Is",
        paragraphs: [
          "Atomic Design is a component architecture methodology coined by Brad Frost that borrows inspiration from chemistry to describe how user interfaces are constructed from modular, interdependent pieces.",
          "Rather than designing monolithic pages or detached ad-hoc widgets, Atomic Design establishes a granular hierarchy that progresses from abstract design tokens and primitives to fully composed, data-driven application pages.",
          "In a living design system, Atomic Design serves as the common taxonomy uniting design tools (Figma, Sketch) and software engineering frameworks (React, Vue, Web Components), ensuring both disciplines speak the exact same compositional language.",
        ],
        quote: {
          text: "We're not designing pages, we're designing systems of components that compose pages.",
          author: "Brad Frost",
        },
      },
      keyConcepts: {
        title: "2. Key Concepts",
        paragraphs: [
          "The atomic methodology progresses through five distinct hierarchical stages:",
        ],
        bullets: [
          {
            label: "Atoms (Primitives)",
            text: "The foundational building blocks that cannot be broken down further without losing functional utility. Examples include HTML tags, inputs, buttons, color tokens, font styles, and raw icons.",
          },
          {
            label: "Molecules (Simple Units)",
            text: "Relatively simple groups of UI atoms functioning together as a unit. For instance, a search form consisting of a text input atom, a button atom, and a label atom.",
          },
          {
            label: "Organisms (Distinct Sections)",
            text: "Complex UI components composed of groups of molecules and atoms joined together to form distinct interface sections, such as a product navigation header or a media card grid.",
          },
          {
            label: "Templates (Page Blueprints)",
            text: "Page-level layout skeletons that arrange organisms, molecules, and atoms into an underlying spatial architecture, focusing on layout structure and responsive breakpoints without final content.",
          },
          {
            label: "Pages (Specific Instances)",
            text: "Concrete instances of templates populated with real content, live API data, and localized text to demonstrate how the UI looks and behaves under actual production conditions.",
          },
        ],
      },
      howToUseIt: {
        title: "3. How to Use It",
        paragraphs: [
          "To implement Atomic Design effectively within your brand workspace:",
          "Start by isolating your atoms. Never build a molecule or organism before its constituent inputs, buttons, and typography tokens have been standardized in your design system library.",
          "Structure your codebase directory to mirror atomic layers (e.g., `src/components/atoms`, `src/components/molecules`, `src/components/organisms`), or group components by domain while maintaining atomic separation within each package.",
          "Audit organism reusability regularly. If an organism is created for a single view, verify whether it can be decomposed into existing molecules to prevent design system bloat.",
        ],
        bullets: [
          {
            label: "Do",
            text: "Treat atoms as strictly agnostic to business context so they remain truly reusable.",
          },
          {
            label: "Do",
            text: "Test layout resilience at the template stage with dynamic content lengths, extreme edge cases, and empty states.",
          },
          {
            label: "Avoid",
            text: "Over-nesting molecules inside molecules, which introduces rigid prop drilling and unnecessary abstraction.",
          },
          {
            label: "Avoid",
            text: "Hardcoding page-specific business logic inside atomic or molecular primitives.",
          },
        ],
      },
    },
    takeaways: {
      uxImpact:
        "Produces predictable, consistent interaction patterns across entire digital ecosystems, eliminating cognitive friction caused by fragmented buttons and inputs.",
      brandPerception:
        "Creates a unified visual rhythm that makes digital applications feel dependable, polished, and crafted by a cohesive engineering team.",
      realWorldRecommendation:
        "Maintain a living component catalog (such as Storybook) organized by atomic tiers to facilitate rapid designer-developer handoff and component governance.",
    },
  },
  {
    id: "color",
    slug: "color",
    title: "Color Science, Contrast & Semantic Tokens",
    subtitle: "Harmonious palette construction, perceptual lightness, and systemic tokens",
    author: "Obare",
    avatar: "/portfolio/obare.avif",
    date: "20 Aug 2026",
    readTime: "9 min read",
    category: "Visual Language",
    excerpt:
      "Color in brand systems is far more than aesthetic expression; it is functional information architecture. By structuring palettes around semantic roles, perceptual color spaces, and programmatic light/dark theme adaptation, brands deliver clarity and emotion.",
    accentColor: "#3b82f6",
    sections: {
      whatItIs: {
        title: "1. What the Guideline Is",
        paragraphs: [
          "Color guidelines define the chromatic palette, contrast ratios, and semantic role mapping used across all digital interfaces, packaging, and brand collateral.",
          "In a living brand studio, color is managed through a multi-tiered token architecture: raw primitive swatches (e.g., Blue-500), semantic tokens (e.g., color-interactive-primary), and component-scoped tokens (e.g., button-primary-bg).",
          "This separation ensures color can adapt dynamically between light appearance and dark appearance without requiring manual CSS rewrites, while safeguarding accessibility compliance across every surface.",
        ],
        quote: {
          text: "Color does not exist in isolation. Its functional value is defined entirely by the spatial contrast and semantic context in which it lives.",
          author: "Josef Albers, Interaction of Color",
        },
      },
      keyConcepts: {
        title: "2. Key Concepts",
        paragraphs: [
          "Mastering color architecture requires understanding modern color spaces and semantic mapping:",
        ],
        bullets: [
          {
            label: "Perceptual Uniformity (OKLCH)",
            text: "Traditional HSL and RGB color models produce inconsistent perceived brightness. Using modern color models like OKLCH ensures uniform perceptual lightness across hues when generating tonal scales.",
          },
          {
            label: "Semantic Role Architecture",
            text: "Colors must be assigned unambiguous functional roles: Primary (dominant brand signal), Neutral (text, borders, surfaces), Interactive (links, buttons), Success (confirmation), Warning (caution), and Destructive (errors).",
          },
          {
            label: "Dark Appearance Inversion",
            text: "Dark mode is not a naive mathematical inversion of light hex codes. Saturated colors must be desaturated to prevent vibration against dark backgrounds, and elevated surfaces must use lighter tinted darks rather than pitch black.",
          },
          {
            label: "60-30-10 Distribution Rule",
            text: "Balanced brand layouts apply the 60-30-10 spatial rule: 60% neutral surface canvas, 30% structural secondary elements, and 10% high-intent brand accent color.",
          },
        ],
      },
      howToUseIt: {
        title: "3. How to Use It",
        paragraphs: [
          "To operationalize color in your brand workflow:",
          "First, generate a 10-step tonal scale (50 to 950) for each brand hue. Ensure the contrast between consecutive steps follows an optical curve rather than linear mathematical increments.",
          "Second, map all interface styling to semantic tokens (e.g., `text-foreground`, `bg-card`, `border-muted`) instead of hardcoded hex values. This enables seamless theming and centralized token updates.",
          "Third, test interactive states across hover, active, focus, and disabled layers. Ensure disabled states clearly communicate inactivity while remaining readable above a 3:1 contrast threshold.",
        ],
        bullets: [
          {
            label: "Do",
            text: "Use semantic token names that describe purpose (e.g., 'surface-danger') rather than visual hue ('red-500').",
          },
          {
            label: "Do",
            text: "Verify automated contrast compliance using APCA (Advanced Perceptual Contrast Algorithm) or WCAG 2.2 AAA.",
          },
          {
            label: "Avoid",
            text: "Using vibrant accent colors for long paragraph text, which causes acute eye strain.",
          },
          {
            label: "Avoid",
            text: "Hardcoding raw hex values in individual component stylesheets.",
          },
        ],
      },
    },
    takeaways: {
      uxImpact:
        "Directs user attention to primary conversion actions with effortless clarity while eliminating eye fatigue across prolonged digital sessions.",
      brandPerception:
        "Projects premium sophistication and disciplined design maturity, ensuring your identity is instantly identifiable even without logo presentation.",
      realWorldRecommendation:
        "Export color tokens as CSS custom properties and JSON variables for direct consumption by web, iOS, and Android production codebases.",
    },
  },
  {
    id: "components",
    slug: "components",
    title: "Component Anatomy, Variants & States",
    subtitle: "Standards for constructing resilient, reusable, and composable UI building blocks",
    author: "Obare",
    avatar: "/portfolio/obare.avif",
    date: "21 Aug 2026",
    readTime: "8 min read",
    category: "Design Systems",
    excerpt:
      "Components are the tangible interface elements through which users experience your brand. Standardizing component anatomy, props, interactive states, and responsive variants guarantees structural predictability across all product surfaces.",
    accentColor: "#10b981",
    sections: {
      whatItIs: {
        title: "1. What the Guideline Is",
        paragraphs: [
          "Component guidelines define the architectural anatomy, variant matrix, interactive behaviors, and accessibility properties of user interface elements.",
          "Whether building a button, modal dialog, dropdown menu, or form field, components encapsulate layout rules, internal padding, icon placements, and micro-animations into a single predictable contract.",
          "By strictly governing component APIs, product teams avoid duplicated engineering effort, eradicate visual drift, and ensure that bug fixes or accessibility improvements propagate instantaneously across all digital touchpoints.",
        ],
        quote: {
          text: "A well-designed component API makes the right thing easy and the wrong thing difficult.",
          author: "Design Systems Community",
        },
      },
      keyConcepts: {
        title: "2. Key Concepts",
        paragraphs: [
          "Every robust component adheres to four architectural pillars:",
        ],
        bullets: [
          {
            label: "Component Anatomy",
            text: "The explicit structural breakdown of internal elements: container container, label, icon slot, helper text, and dismiss action.",
          },
          {
            label: "Variant Hierarchy",
            text: "A structured continuum of visual weight: Primary (high-intent solid fill), Secondary (subtle tint or outline), Ghost/Tertiary (borderless quiet action), and Destructive (danger confirmation).",
          },
          {
            label: "Comprehensive State Matrix",
            text: "Every component must define visual specifications for Default, Hover, Active/Pressed, Focused, Loading, Disabled, and Error states.",
          },
          {
            label: "Composition over Configuration",
            text: "Favor flexible slot composition (e.g., allowing custom leading or trailing icons) over rigid boolean props that limit component adaptability.",
          },
        ],
      },
      howToUseIt: {
        title: "3. How to Use It",
        paragraphs: [
          "Follow this sequence when designing and building new system components:",
          "Step 1: Map all states before writing production code. Never ship a component that lacks explicit focus rings, hover transitions, or loading spinner indicators.",
          "Step 2: Standardize size tokens (sm, md, lg) with proportional padding, font sizes, and icon scales to ensure visual harmony when components sit side by side.",
          "Step 3: Document component props, code snippets, and misuse examples in your brand library so contributing engineers understand intended implementation patterns.",
        ],
        bullets: [
          {
            label: "Do",
            text: "Use the standardized Loader spinner component for all asynchronous button and card states.",
          },
          {
            label: "Do",
            text: "Ensure keyboard enter and spacebar keys trigger button actions identical to mouse clicks.",
          },
          {
            label: "Avoid",
            text: "Creating one-off custom buttons that bypass your design system component library.",
          },
          {
            label: "Avoid",
            text: "Overloading components with 20+ configuration props instead of clean child composition.",
          },
        ],
      },
    },
    takeaways: {
      uxImpact:
        "Reduces interaction friction through muscle memory; users instantly understand how to operate familiar controls regardless of which page they land on.",
      brandPerception:
        "Fosters deep user trust by eliminating jarring discrepancies, unstyled loading states, or broken responsive layouts.",
      realWorldRecommendation:
        "Implement automated visual regression tests (using Playwright or Percy) to catch unintended component visual regressions before shipping to production.",
    },
  },
  {
    id: "foundations",
    slug: "foundations",
    title: "Design Foundations, Grid & Spatial Harmony",
    subtitle: "Mathematical spacing scales, layout grids, elevation, and structural principles",
    author: "Obare",
    avatar: "/portfolio/obare.avif",
    date: "22 Aug 2026",
    readTime: "7 min read",
    category: "Architecture",
    excerpt:
      "Foundations are the invisible rules that hold a visual system together. Spacing scales, optical layout grids, border radii, and z-index elevation layers create an underlying harmony that guides human perception and spatial navigation.",
    accentColor: "#8b5cf6",
    sections: {
      whatItIs: {
        title: "1. What the Guideline Is",
        paragraphs: [
          "Design foundations represent the bedrock geometric and spatial rules upon which all components, screens, and marketing assets are constructed.",
          "These guidelines establish the 8pt/4pt mathematical spacing scale, responsive column grids, corner radius hierarchies, motion duration curves, and atmospheric elevation layers.",
          "Without disciplined foundations, digital interfaces quickly descend into optical chaos, featuring misaligned margins, arbitrary padding, and disjointed spatial depths that fatigue user attention.",
        ],
        quote: {
          text: "Order and simplification are the first steps toward mastery of a subject.",
          author: "Thomas Mann",
        },
      },
      keyConcepts: {
        title: "2. Key Concepts",
        paragraphs: [
          "The foundational system is anchored by four fundamental spatial paradigms:",
        ],
        bullets: [
          {
            label: "The 8pt Spacing Scale",
            text: "All padding, margins, and layout dimensions are strict multiples of 4px and 8px (4, 8, 12, 16, 24, 32, 48, 64, 96px), ensuring harmonious proportional rhythm.",
          },
          {
            label: "Responsive Grid Columns",
            text: "12-column grid on desktop (with 24px gutters), 8-column grid on tablets (16px gutters), and 4-column grid on mobile (12px gutters) within centered containers.",
          },
          {
            label: "Curated Corner Radii",
            text: "A unified radius system: Small (4px for badges), Medium (8px for inputs/buttons), Large (12px to 16px for cards), and Pill (full round for active chips).",
          },
          {
            label: "Elevation & Atmospheric Depth",
            text: "Layered z-index scales and diffused ambient shadows that convey depth and establish clear interactive hierarchy between background canvas and modal layers.",
          },
        ],
      },
      howToUseIt: {
        title: "3. How to Use It",
        paragraphs: [
          "Apply spatial foundations consistently across product design:",
          "Use the 8pt scale for all container margins and section separations. When spacing dense micro-elements within cards or buttons, step down to the 4pt sub-grid.",
          "Never introduce arbitrary margin values like 13px or 27px. Constrain all spacing choices strictly to predefined spacing utility tokens.",
          "Ensure card components and elevated dialogs utilize subtle borders paired with diffused shadows to preserve surface separation in both light and dark appearances.",
        ],
        bullets: [
          {
            label: "Do",
            text: "Align all page containers to centered max-width boundaries for comfortable scanning.",
          },
          {
            label: "Do",
            text: "Combine subtle 1px border outlines with diffuse ambient glow for modern glassmorphism depth.",
          },
          {
            label: "Avoid",
            text: "Arbitrary spacing values that violate the 4pt/8pt modular grid scale.",
          },
          {
            label: "Avoid",
            text: "Harsh, pitch-black drop shadows that create visual clutter instead of natural depth.",
          },
        ],
      },
    },
    takeaways: {
      uxImpact:
        "Creates an effortless reading rhythm and spatial hierarchy that guides the human eye naturally from primary headers to key conversion actions.",
      brandPerception:
        "Evokes institutional polish and precision craftsmanship, establishing immediate credibility with discerning professional users.",
      realWorldRecommendation:
        "Enforce spacing tokens through strict linter rules and design token plugins to prevent hardcoded pixel values in production stylesheets.",
    },
  },
  {
    id: "icons",
    slug: "icons",
    title: "Iconography Systems & Optical Grids",
    subtitle: "Vector icon design, optical weight balance, and accessibility labeling",
    author: "Obare",
    avatar: "/portfolio/obare.avif",
    date: "23 Aug 2026",
    readTime: "7 min read",
    category: "Visual Language",
    excerpt:
      "Icons are universal visual shorthand that guide navigation, communicate system states, and reinforce brand character. A disciplined iconography system ensures uniform stroke weights, optical bounding boxes, and accessible screen reader labeling.",
    accentColor: "#f59e0b",
    sections: {
      whatItIs: {
        title: "1. What the Guideline Is",
        paragraphs: [
          "Iconography guidelines define the visual style, optical grids, stroke weights, corner geometry, and functional usage of vector symbols across your product ecosystem.",
          "Whether utilizing outline symbols or filled glyphs, icons must share consistent visual metaphors, geometric curves, and optical weights so no single symbol draws disproportionate visual attention.",
          "Crucially, icons in user interfaces are functional wayfinding tools. The guideline establishes when icons should stand alone, when they require accompanying text labels, and how to ensure screen reader accessibility.",
        ],
        quote: {
          text: "Icons should communicate at a glance. If an icon requires explanation, it has failed its primary purpose.",
          author: "Graphic Design Maxim",
        },
      },
      keyConcepts: {
        title: "2. Key Concepts",
        paragraphs: [
          "A professional icon system is governed by four core optical principles:",
        ],
        bullets: [
          {
            label: "The 24x24 Optical Grid",
            text: "Icons are drawn on a standardized 24x24 pixel grid with a 2px interior padding boundary, allowing optical weight balance across circular, square, and rectangular glyphs.",
          },
          {
            label: "Consistent Stroke Weight",
            text: "A uniform stroke weight (typically 1.5px or 2px) must be maintained across all outline icons, scaling proportionally with font size using currentColor.",
          },
          {
            label: "Corner Radius Harmony",
            text: "Terminal stroke caps and interior corner angles must mirror the corner radius rules of the broader design system (e.g., rounded caps for friendly interfaces).",
          },
          {
            label: "Functional Accessibility",
            text: "Icons that trigger actions without accompanying text must provide an explicit aria-label. Icons alongside text are marked decorative with aria-hidden='true'.",
          },
        ],
      },
      howToUseIt: {
        title: "3. How to Use It",
        paragraphs: [
          "Implement icons systematically across UI surfaces:",
          "First, maintain an authorized vector icon library (e.g., using Tabler Icons or Boxicons) to prevent conflicting visual styles or mismatched stroke weights.",
          "Second, pair icons with concise text labels wherever space permits. Standalone icon buttons must be reserved exclusively for globally recognized universal metaphors (search, close, settings, trash).",
          "Third, use icons purposefully to reinforce hierarchy. Never scatter icons gratuitously across every list item or menu entry, which dilutes their wayfinding value.",
        ],
        bullets: [
          {
            label: "Do",
            text: "Inherit text color via 'currentColor' so icons adapt automatically across theme and hover states.",
          },
          {
            label: "Do",
            text: "Provide clear tooltip help tags on desktop hover for icon-only action buttons.",
          },
          {
            label: "Avoid",
            text: "Mixing filled and outline icon styles arbitrarily within the same navigation level.",
          },
          {
            label: "Avoid",
            text: "Inventing esoteric or ambiguous icon metaphors for common user actions.",
          },
        ],
      },
    },
    takeaways: {
      uxImpact:
        "Accelerates interface scanning and recognition speeds by up to 40% compared to text-only menus when paired with clear descriptive labels.",
      brandPerception:
        "Infuses product surfaces with refined aesthetic charm and meticulous attention to detail.",
      realWorldRecommendation:
        "Export icons as single optimized SVG components with stripped stroke/fill attributes to allow dynamic sizing and CSS styling.",
    },
  },
  {
    id: "imagery",
    slug: "imagery",
    title: "Imagery, Art Direction & Visual Hierarchy",
    subtitle: "Product photography, authentic human context, composition, and treatment standards",
    author: "Obare",
    avatar: "/portfolio/obare.avif",
    date: "24 Aug 2026",
    readTime: "8 min read",
    category: "Visual Language",
    excerpt:
      "Imagery sets the emotional tone of a brand. Art direction guidelines govern product staging, natural lighting, authentic human representation, and compositional framing to ensure visual storytelling feels genuine, aspirational, and unforced.",
    accentColor: "#14b8a6",
    sections: {
      whatItIs: {
        title: "1. What the Guideline Is",
        paragraphs: [
          "Imagery guidelines establish the photographic style, art direction principles, subject framing, color grading, and responsive image formats for brand marketing and product visuals.",
          "Visual content communicates brand values faster than copy. The imagery guideline ensures every photo, mockup, and illustration feels cohesive with the product's overarching design philosophy.",
          "From clean product studio photography against infinite backdrops to authentic lifestyle captures, these standards eliminate generic stock photography clichés in favor of purposeful visual storytelling.",
        ],
        quote: {
          text: "Authenticity in imagery cannot be faked. True emotional resonance comes from real light, real materials, and genuine human moments.",
          author: "Design Studio Directives",
        },
      },
      keyConcepts: {
        title: "2. Key Concepts",
        paragraphs: [
          "Four core pillars define authentic visual art direction:",
        ],
        bullets: [
          {
            label: "Product-First Realism",
            text: "Hardware and physical goods are depicted with sculptural precision, natural reflections, and true-to-life surface textures without artificial CGI exaggeration.",
          },
          {
            label: "Natural, Directional Lighting",
            text: "Avoid harsh, synthetic studio flashes or flat lighting. Emphasize soft, natural directional light with gentle contact shadows that ground objects in physical space.",
          },
          {
            label: "Authentic Human Diversity",
            text: "Human subjects must reflect real diversity in ethnicity, age, gender, and ability, portrayed in genuine contextual environments rather than staged commercial poses.",
          },
          {
            label: "Intentional Framing & Aspect Ratios",
            text: "Standardize aspect ratios (16:9 for landscape banners, 4:3 for feature cards, 1:1 for product avatars) with generous negative space for responsive cropping.",
          },
        ],
      },
      howToUseIt: {
        title: "3. How to Use It",
        paragraphs: [
          "Apply art direction rules throughout your visual assets:",
          "First, establish consistent color grading and exposure standards. Maintain warm, neutral tones and avoid extreme saturation or heavy Instagram-style filters.",
          "Second, ensure digital screens displayed inside hardware mockups render at exact 1:1 pixel ratios with authentic operating system UI elements and no skewing.",
          "Third, optimize all photographic assets for modern web delivery using modern formats (WebP, AVIF) with responsive srcset attributes and progressive blur placeholding.",
        ],
        bullets: [
          {
            label: "Do",
            text: "Use high-resolution, uncompressed source photography optimized into modern AVIF and WebP formats.",
          },
          {
            label: "Do",
            text: "Leave ample negative space around focal subjects to accommodate responsive viewport cropping.",
          },
          {
            label: "Avoid",
            text: "Generic stock photography featuring models pointing at laptops or forced office handshakes.",
          },
          {
            label: "Avoid",
            text: "Distorting hardware geometry with unnatural 3D fisheye perspectives.",
          },
        ],
      },
    },
    takeaways: {
      uxImpact:
        "Reduces page weight by up to 70% through modern responsive image formats while elevating visual comprehension of product capabilities.",
      brandPerception:
        "Builds emotional resonance and authentic credibility, separating your brand from generic commodity competitors.",
      realWorldRecommendation:
        "Maintain a centralized digital asset management (DAM) repository with pre-cropped aspect ratios and approved color-graded imagery.",
    },
  },
  {
    id: "typography",
    slug: "typography",
    title: "Typography Systems, Modular Scales & Vertical Rhythm",
    subtitle: "Type hierarchy, optical sizes, modular scales, and cross-platform typesetting",
    author: "Obare",
    avatar: "/portfolio/obare.avif",
    date: "25 Aug 2026",
    readTime: "9 min read",
    category: "Typography",
    excerpt:
      "Typography is the voice of the product. By governing typographic hierarchy, modular scale ratios, optical tracking, and vertical baseline rhythm, brand systems create an effortless reading experience across every digital viewport.",
    accentColor: "#0ea5e9",
    sections: {
      whatItIs: {
        title: "1. What the Guideline Is",
        paragraphs: [
          "Typography guidelines establish the font families, modular type scale, weight spectrum, line height ratios, letter spacing (tracking), and typesetting rules for all written communications.",
          "In digital interfaces, typography accounts for over 90% of user interactions. A disciplined typographic system balances aesthetic brand character with uncompromising legibility.",
          "The guideline provides clear formulas for computing type sizes across responsive breakpoints, ensuring headings command authority while body copy remains effortless to read across prolonged sessions.",
        ],
        quote: {
          text: "Typography is the craft of endowing human language with a durable visual form.",
          author: "Robert Bringhurst, The Elements of Typographic Style",
        },
      },
      keyConcepts: {
        title: "2. Key Concepts",
        paragraphs: [
          "Mastering digital typography requires understanding four core structural concepts:",
        ],
        bullets: [
          {
            label: "Modular Type Scale",
            text: "Font sizes are derived from a mathematical ratio (such as the Major Third 1.25 or Perfect Fourth 1.333), creating a harmonious progression from caption to display.",
          },
          {
            label: "Optical Sizing & Dynamic Tracking",
            text: "Large display headlines require tighter letter spacing (negative tracking) to maintain cohesion, while small body copy and captions require open tracking to enhance legibility.",
          },
          {
            label: "Proportional Line Height",
            text: "Line height must scale inversely with font size: large display headings require tight leading (1.15x to 1.25x), while small body text requires generous leading (1.45x to 1.6x).",
          },
          {
            label: "Optimal Line Length (Measure)",
            text: "Maintain paragraph column widths between 45 and 75 characters (60 characters ideal) to prevent reader fatigue when scanning from line end to line start.",
          },
        ],
      },
      howToUseIt: {
        title: "3. How to Use It",
        paragraphs: [
          "To operationalize typography across your design system:",
          "First, limit your typeface palette to two well-paired families: a distinctive display or heading typeface paired with a highly legible neutral sans-serif or serif for body copy.",
          "Second, establish strict semantic heading levels (H1 through H4) and ensure HTML heading tags match visual importance without skipping hierarchical levels.",
          "Third, enforce professional typesetting rules: always use curly apostrophes (’) and quotation marks (“ ”), en dashes (–) for numeric ranges, and proper nonbreaking spaces with units of measure.",
        ],
        bullets: [
          {
            label: "Do",
            text: "Use modern variable fonts to access precise weight variations while minimizing font file payload.",
          },
          {
            label: "Do",
            text: "Maintain a minimum body font size of 16px (1rem) for effortless reading on desktop and mobile screens.",
          },
          {
            label: "Avoid",
            text: "Pairing two typefaces from the same sub-genre that look almost identical but subtly clash.",
          },
          {
            label: "Avoid",
            text: "Justified text alignment on the web, which creates awkward typographic 'rivers' of whitespace.",
          },
        ],
      },
    },
    takeaways: {
      uxImpact:
        "Dramatically improves reading speed, information retention, and scanning efficiency across dense documentation and content-heavy interfaces.",
      brandPerception:
        "Communicates calm authority, literary refinement, and deep engineering discipline.",
      realWorldRecommendation:
        "Preload critical primary font files in the document head and specify system font fallbacks to eliminate layout shift (CLS) during initial page load.",
    },
  },
]

/**
 * Summary cards for the Guidelines tab on the dashboard.
 */
export const GUIDELINE_SUMMARIES: GuidelineCardSummary[] = GUIDELINE_ARTICLES.map(
  (article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title.split("&")[0].trim(),
    subtitle: article.subtitle,
    category: article.category,
    description: article.excerpt,
    readTime: article.readTime,
    accentColor: article.accentColor,
  })
)
