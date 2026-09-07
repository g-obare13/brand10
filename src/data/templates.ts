/**
 * @file templates.ts
 * @description Official Apple Style Guide (June 2026 Edition) dataset.
 * Sourced directly from official Apple documentation to showcase authentic
 * editorial standards, writing rules, terminology conventions, and brand architecture.
 */

export interface EditorialExample {
  correct: string
  avoid?: string
  incorrect?: string
  note?: string
}

export interface EditorialRule {
  title: string
  explanation: string
  examples?: EditorialExample[]
}

export interface EditorialTable {
  caption?: string
  headers: string[]
  rows: string[][]
}

export interface ArticleSubsection {
  id: string
  title: string
  paragraphs: string[]
  quote?: string
  rules?: EditorialRule[]
  table?: EditorialTable
}

export interface ArticleSection {
  id: string
  number: string
  title: string
  lead: string
  subsections: ArticleSubsection[]
}

export interface AppleStyleGuideDocument {
  id: string
  title: string
  subtitle: string
  edition: string
  author: string
  curator: string
  lastUpdated: string
  readTime: string
  category: string
  overview: string
  sections: ArticleSection[]
}

export interface BrandCatalogItem {
  id: string
  name: string
  badge: string
  category: string
  description: string
  edition: string
  colors: string[]
  fontFamily: string
  sectionCount: number
  isFeatured: boolean
  url: string
  internalRoute?: string
}

/**
 * Official Apple Style Guide Document (June 2026 Edition).
 * Comprehensive editorial and brand governance standard.
 */
export const APPLE_STYLE_GUIDE_DOC: AppleStyleGuideDocument = {
  id: "apple",
  title: "Apple Style Guide",
  subtitle: "Editorial Guidelines & Brand Voice Architecture",
  edition: "June 2026 Edition",
  author: "Apple Inc. Corporate Identity",
  curator: "Curated by Obare",
  lastUpdated: "June 2026",
  readTime: "15 min read",
  category: "Official Style Guide",
  overview:
    "The Apple Style Guide provides editorial guidelines for text in Apple instructional materials, technical documentation, reference information, training programs, and user interfaces. The intent of these guidelines is to help maintain a consistent, clear, and human-centric voice across all Apple materials. Writers, editors, and developers can use this document as a benchmark for how world-class organizations govern brand voice, terminology, typography, and accessibility.",
  sections: [
    {
      id: "about-this-guide",
      number: "1",
      title: "About this guide",
      lead: "Establishing editorial consistency across platforms, documentation, and user interfaces.",
      subsections: [
        {
          id: "scope-and-purpose",
          title: "Purpose and Audience",
          paragraphs: [
            "The Apple Style Guide serves as the authoritative standard for all user-facing communication, developer documentation, and software interface copywriting.",
            "Writers and editors should thoroughly review the guide to become familiar with the range of issues involved in creating high-quality, readable, and consistent materials. Apple developers and third-party developers should follow these guidelines for user-facing text.",
          ],
          quote:
            "The intent of these guidelines is to help maintain a consistent voice in Apple materials across every medium and device.",
        },
        {
          id: "editorial-resources",
          title: "Editorial Resources Used at Apple",
          paragraphs: [
            "In general, Apple publications follow the style and usage rules in Merriam-Webster's Collegiate Dictionary and The Chicago Manual of Style. Exceptions to guidelines in these resources are noted throughout this guide.",
            "In cases where resources conflict with each other, follow The Chicago Manual of Style for style and usage questions, and Merriam-Webster's Collegiate Dictionary for spelling guidance. For user interface design and interaction behaviors, refer to Apple's Human Interface Guidelines.",
          ],
        },
        {
          id: "conventions-used",
          title: "Conventions Used in This Guide",
          paragraphs: [
            "Modifiers consisting of two or more words are often hyphenated when they precede a noun, but not when they follow the verb as a compound predicate adjective. This guide distinguishes the differences as follows:",
          ],
          rules: [
            {
              title: "Pre-noun Modifiers vs. Predicate Adjectives",
              explanation:
                "An entry followed by (adj.) indicates the form when the adjective immediately precedes the noun it modifies. An entry followed by (pred. adj.) gives the form when used as a predicate adjective.",
              examples: [
                {
                  correct: "user-friendly (adj.), user friendly (pred. adj.)",
                  note: "A user-friendly interface is an interface that is user friendly.",
                },
                {
                  correct: "built-in (adj.), built in (pred. adj.)",
                  note: "The built-in microphone is built in to the display.",
                },
              ],
            },
          ],
        },
        {
          id: "recent-changes",
          title: "Key Updates in the June 2026 Edition",
          paragraphs: [
            "The June 2026 edition introduces official terminology for new platforms, AI systems, and hardware features:",
          ],
          table: {
            caption: "June 2026 New & Updated Terminology Entries",
            headers: ["Term / Entry", "Classification", "Official Apple Usage Directive"],
            rows: [
              [
                "Apple Intelligence",
                "Personal AI System",
                "Apple's personal intelligence system. Never abbreviate as 'AI'. Capitalize both words.",
              ],
              [
                "Apple Account",
                "Identity & Auth",
                "Replaces former 'Apple ID'. Users sign in to their Apple Account, not with their account.",
              ],
              [
                "Liquid Glass",
                "Interface Design",
                "Visual glasslike design language across Apple devices. Do not precede with 'the'.",
              ],
              [
                "Action button",
                "Hardware Control",
                "Customizable button on Apple Watch Ultra and iPhone models. Lowercase 'button'.",
              ],
              [
                "M-series chips",
                "Apple Silicon",
                "SoC family (M1 through M5). Chip names take Pro, Max, and Ultra. Never refer to as a processor.",
              ],
              [
                "Apple Creator Studio",
                "Subscription Suite",
                "Creative application ecosystem. Do not precede with 'the'.",
              ],
            ],
          },
        },
      ],
    },
    {
      id: "voice-and-usage",
      number: "2",
      title: "Core style and voice directives",
      lead: "Principles for crafting clear, direct, and unpretentious user communication.",
      subsections: [
        {
          id: "addressing-the-user",
          title: "Address the Reader Directly",
          paragraphs: [
            "Apple documentation speaks directly to the individual. If the audience consists of users, avoid the word 'user' and address the reader as 'you'.",
          ],
          rules: [
            {
              title: "Reader as Active Subject",
              explanation: "Structure instructions around what the reader accomplishes rather than passive third-person descriptions.",
              examples: [
                {
                  correct: "You can make movies with effects and a soundtrack.",
                  incorrect: "Users can make movies with effects and a soundtrack.",
                },
                {
                  correct: "You can create a database with FileMaker Pro.",
                  avoid: "FileMaker Pro allows you to create a database.",
                },
              ],
            },
          ],
        },
        {
          id: "interaction-verbs",
          title: "Precise Interaction Verbs",
          paragraphs: [
            "Use verbs that accurately reflect the physical or virtual modality of the device:",
          ],
          rules: [
            {
              title: "Click vs. Tap vs. Press",
              explanation:
                "You click or tap an onscreen button. You press a mechanical hardware button or a keyboard key. Never use 'click on', 'hit', or 'push'.",
              examples: [
                {
                  correct: "Click the Edit button in the toolbar.",
                  incorrect: "Click on the Edit button in the toolbar.",
                },
                {
                  correct: "Press the Return key to confirm.",
                  incorrect: "Hit the Return key to confirm.",
                },
                {
                  correct: "Tap the screen to wake your iPhone.",
                  avoid: "Touch the screen to wake your iPhone.",
                },
              ],
            },
            {
              title: "Turn On vs. Activate vs. Enable",
              explanation:
                "Use 'turn on' and 'turn off' for features, settings, and switches. Avoid 'activate', 'deactivate', and 'enable'. 'Enable' is only used when a prerequisite task makes a subsequent task possible.",
              examples: [
                {
                  correct: "Turn on Windows file sharing.",
                  incorrect: "Enable Windows file sharing.",
                },
                {
                  correct: "Tap the switch to turn Airplane Mode on or off.",
                  incorrect: "Slide the switch to toggle Airplane Mode.",
                },
              ],
            },
            {
              title: "Choose vs. Select",
              explanation:
                "Users select objects, files, text ranges, and checkboxes. Users choose commands and menu items.",
              examples: [
                {
                  correct: "Select the image, and then choose Edit > Copy.",
                  incorrect: "Choose the image, and then select Edit > Copy.",
                },
              ],
            },
          ],
        },
        {
          id: "contractions-and-tone",
          title: "Contractions and Informal Warmth",
          paragraphs: [
            "As part of Apple's informal voice, contractions are recommended throughout most documentation, interface copy, and marketing communications.",
            "Use common contractions of be-verbs and auxiliary verbs (isn't, can't, don't, here's, let's, that's). However, avoid forming contractions from nouns or proper nouns (say 'The computer isn't working', not 'The computer's not working').",
          ],
        },
      ],
    },
    {
      id: "writing-inclusively",
      number: "3",
      title: "Writing inclusively",
      lead: "Conscious communication that respects global diversity, eliminates oppressive metaphors, and embraces everyone.",
      subsections: [
        {
          id: "inclusive-principles",
          title: "General Principles",
          paragraphs: [
            "The people who use Apple products reflect the diversity of the world at large. Writing consciously requires imagining content from the reader's perspective: Will the words and phrases be understood by everyone? Do they carry harmful historical associations?",
            "Avoid idioms and colloquial expressions like 'fall through the cracks', 'backseat driver', or 'on the same page' that do not translate well across international locales.",
          ],
        },
        {
          id: "oppressive-metaphors",
          title: "Eliminating Oppressive and Ableist Terminology",
          paragraphs: [
            "Do not describe computing events or system architectures using oppressive, violent, or ableist metaphors.",
          ],
          rules: [
            {
              title: "Allow List and Deny List",
              explanation: "Do not use 'whitelist' or 'blacklist'. Use objective, descriptive alternatives.",
              examples: [
                {
                  correct: "Add the IP address to your server's allow list.",
                  incorrect: "Add the IP address to your server's whitelist.",
                },
              ],
            },
            {
              title: "Primary and Secondary / Replica",
              explanation: "Do not use 'master' and 'slave' to describe relationships between devices or processes.",
              examples: [
                {
                  correct: "Input received on the primary device is synced to the secondary device.",
                  incorrect: "Input received on the master device is synced to the slave device.",
                },
                {
                  correct: "Switch to the main branch of the repository.",
                  incorrect: "Switch to the master branch of the repository.",
                },
              ],
            },
            {
              title: "Objective System Behavior",
              explanation: "Avoid violent words like 'kill' or 'hang'. Describe the exact software behavior.",
              examples: [
                {
                  correct: "Cancel all background tasks.",
                  incorrect: "Kill all background tasks.",
                },
                {
                  correct: "If the application stops responding, choose Force Quit.",
                  incorrect: "If the application hangs or crashes, choose Force Quit.",
                },
              ],
            },
          ],
        },
        {
          id: "gender-and-pronouns",
          title: "Gender Identity and Pronouns",
          paragraphs: [
            "Avoid binary representations of gender when you can reword using gender-neutral language (say 'Hiring people of diverse backgrounds', not 'Hiring men and women').",
            "When referring to individuals of unspecified gender, do not use gender-specific pronouns (he, his, she, her) or awkward combinations (he/she, s/he). Use singular they, their, or them.",
          ],
          rules: [
            {
              title: "Singular They / Their / Them",
              explanation: "Singular 'they' takes a plural verb even when used for a singular person.",
              examples: [
                {
                  correct: "A subscriber can post their recipes to your shared folder.",
                  incorrect: "A subscriber can post his or her recipes to your shared folder.",
                },
              ],
            },
          ],
        },
        {
          id: "disability-guide",
          title: "Guide to Terms About Disability",
          paragraphs: [
            "When writing about people with disabilities, focus on each individual's authentic achievements and personality. Acknowledge disability on a spectrum and avoid patronizing language like 'brave', 'inspiring', or 'special needs'.",
          ],
          table: {
            caption: "Apple Disability Terminology Standard",
            headers: ["Identity-First", "Person-First", "Terms to Avoid"],
            rows: [
              ["A disabled person / Disabled people", "A person with a disability / People with disabilities", "Differently abled, Special needs, Handicapped"],
              ["A blind person", "A person who is blind / A person who has low vision", "Visually impaired (unless specifically preferred)"],
              ["A Deaf person (capital D for culture)", "A person who is deaf / A person who is hard of hearing", "Hearing impaired, Deaf and dumb, Deaf-mute"],
              ["A DeafBlind person", "A person who is deaf and blind", "Deaf-blind (hyphenated), Hearing and visually impaired"],
              ["An autistic person / Autistic people", "A person on the autism spectrum", "Asperger's, High-functioning / low-functioning"],
              ["A neurodivergent person", "A person with a neurodivergence", "A neurodiverse person (groups are diverse, not individuals)"],
              ["A wheelchair user", "A person who uses a wheelchair", "Wheelchair-bound, Confined to a wheelchair"],
              ["A nonspeaking person", "A person who is nonspeaking", "Mute"],
            ],
          },
        },
      ],
    },
    {
      id: "technical-notation",
      number: "4",
      title: "Units of measure and technical notation",
      lead: "Formatting conventions for scientific measurement, code expressions, and numbers.",
      subsections: [
        {
          id: "units-of-measure",
          title: "International System of Units (SI)",
          paragraphs: [
            "Use only International System of Units (SI) symbols to express quantities. Insert a nonbreaking space between the number and the unit symbol. Unit symbols are unaltered in plural forms and are never hyphenated when used as adjectives.",
          ],
          rules: [
            {
              title: "Unit Spacing & Adjective Usage",
              explanation:
                "When a unit is spelled out, hyphenate the compound adjective (17-inch display). When an abbreviation is used, do not hyphenate (30 GB capacity).",
              examples: [
                {
                  correct: "20 GB of memory; 17-inch display; 3-meter cable; a 30 GB SSD.",
                  incorrect: "20GB of memory; 17 inch display; a 30-GB SSD.",
                },
              ],
            },
          ],
          table: {
            caption: "Common Units and Official Apple Symbols",
            headers: ["Quantity", "Spelled-Out Unit", "Symbol", "Example Usage"],
            rows: [
              ["Computer Memory / Storage", "gigabyte / gigabit", "GB / Gbit", "16 GB of memory, 1 TB SSD"],
              ["Data Transfer Rate", "gigabits per second", "Gbit/s (or Gbps)", "Thunderbolt 5 up to 120 Gbit/s"],
              ["Frequency / Clock Speed", "gigahertz", "GHz", "at a rate of 3.0 GHz"],
              ["Optical Display Size", "inch", "in.", "13-inch iPad Pro, 27-inch iMac"],
              ["Video Frame Rate", "frames per second", "fps", "records ProRes at 60 fps"],
              ["Electric Power", "watt", "W", "the 30W USB-C Power Adapter"],
            ],
          },
        },
        {
          id: "code-font-rules",
          title: "Code Font Conventions in Text",
          paragraphs: [
            "Use fixed-width code font (SF Mono) for all text fragments that represent expressions in a programming language, literal identifiers, variables, file names with extensions, and shell commands.",
            "In user materials, do not use code font for part or chapter titles, text headings, cross-references, table of contents entries, or internet addresses (use regular roman font for URLs).",
          ],
          rules: [
            {
              title: "Punctuation Following Code Font",
              explanation: "Use regular body font for punctuation following a code snippet, unless the punctuation is part of the code itself.",
              examples: [
                {
                  correct: "NAN(004), nan(4), and NaN are examples of valid input.",
                  note: "The commas and 'and' are in regular body font.",
                },
              ],
            },
          ],
        },
        {
          id: "number-formatting",
          title: "Number Formatting Conventions",
          paragraphs: [
            "Spell out cardinal numbers from one through nine in running text. Use numerals for 10 and above, for all units of measure (regardless of size), and when expressing amounts of memory.",
            "Use an en dash (–) without spaces between numbers that represent the endpoints of a continuous range: 'pages 12–24', 'bits 3–17', '2023–2026'. Do not use a hyphen.",
          ],
        },
      ],
    },
    {
      id: "trademarks-and-international",
      number: "5",
      title: "Product naming, trademarks, and international style",
      lead: "Legal brand governance, product lockup integrity, and international localization standards.",
      subsections: [
        {
          id: "trademark-grammar",
          title: "The Golden Rules of Apple Product Names",
          paragraphs: [
            "Apple trademarks represent decades of brand equity and must be preserved with grammatical precision across all communications.",
          ],
          rules: [
            {
              title: "Never Use Trademarks as Verbs",
              explanation: "Do not transform product names into action verbs.",
              examples: [
                {
                  correct: "Make a FaceTime call to your team.",
                  incorrect: "FaceTime your team.",
                },
                {
                  correct: "Use AirDrop to share photos with friends nearby.",
                  incorrect: "AirDrop the photos to your friends.",
                },
                {
                  correct: "Identify a song using Shazam.",
                  incorrect: "Shazam the song playing right now.",
                },
              ],
            },
            {
              title: "Never Pluralize or Possessivize Trademarks",
              explanation: "Attach a plural generic noun to the singular product name. Rewrite to avoid possessives.",
              examples: [
                {
                  correct: "Mac computers, MacBook Pro models, iPad devices.",
                  incorrect: "Macs, MacBook Pros, iPads.",
                },
                {
                  correct: "Learn about the capabilities of your iPhone.",
                  incorrect: "Learn about your iPhone's capabilities.",
                },
              ],
            },
            {
              title: "Preserve Exact Capitalization",
              explanation: "Products with lowercase prefixes (iPhone, iPad, macOS, tvOS, visionOS) preserve their lowercase letter even at the beginning of a sentence or heading.",
              examples: [
                {
                  correct: "iPhone features advanced camera sensors; Set up your Mac mini.",
                  incorrect: "IPhone features advanced camera sensors; Set up your Mac Mini.",
                },
              ],
            },
            {
              title: "Never Replace 'Apple' with the Logo Symbol in Running Text",
              explanation: "The Apple logo is an insignia, not a typographical character. In text, write 'Apple News+', never 'News+'.",
              examples: [
                {
                  correct: "Subscribe to Apple Music; Enjoy Apple TV content.",
                  incorrect: "Subscribe to Music; Enjoy TV content.",
                },
              ],
            },
          ],
        },
        {
          id: "international-style",
          title: "International Conventions (ISO Standards)",
          paragraphs: [
            "Following international standards ensures unambiguous communication across international audiences and simplifies localization into global languages:",
          ],
          table: {
            caption: "International Standards Applied at Apple",
            headers: ["Element", "Standard", "Format Directive", "Example"],
            rows: [
              ["Country Codes", "ISO 3166", "Two-character uppercase alpha code", "DE (Germany), JP (Japan), US (United States)"],
              ["Currency Codes", "ISO 4217", "Three-letter code preceded by amount and space", "The computer is priced at 1199 USD (or 1980 EUR)"],
              ["Date Notation", "ISO 8601", "Year-month-day separated by hyphens", "2026-06-08 (avoids month/day ambiguity)"],
              ["Time Notation", "24-Hour Clock", "Hours and minutes separated by colon; UTC suffix", "The release will be published at 18:00Z"],
              ["Phone Numbers", "ITU-T E.123", "Plus sign (+) with country code, area code, and number", "+1 408 996 1010 (toll number always provided)"],
            ],
          },
        },
        {
          id: "legal-boilerplate",
          title: "Official Copyright and Trademark Notice",
          paragraphs: [
            "All formal documentation must conclude with the verified Apple Inc. corporate boilerplate:",
          ],
          quote:
            "Apple, the Apple logo, AirDrop, AirPods, Apple Books, Apple Card, Apple Cash, Apple Music, Apple News, Apple Pay, Apple Pencil, Apple TV, Apple Vision Pro, Apple Watch, Digital Crown, Dynamic Island, Face ID, FaceTime, Final Cut Pro, Finder, iCloud, iPad, iPhone, Mac, MacBook, macOS, Magic Keyboard, Retina, Safari, Siri, Spotlight, and watchOS are trademarks of Apple Inc., registered in the U.S. and other countries and regions.",
        },
      ],
    },
  ],
}

/**
 * Catalog list of real-world brand guideline showcase items for the dashboard templates tab.
 */
export const BRAND_SHOWCASE_CATALOG: BrandCatalogItem[] = [
  {
    id: "adobe-spectrum",
    name: "Adobe Spectrum",
    badge: "Design Principles & Tokens",
    category: "Creative Tools & Experience Platform",
    description:
      "Adobe's comprehensive design system providing component guidelines, design tokens, and core principles for building coherent creative applications.",
    edition: "Spectrum 2 Specification",
    colors: ["#EB1000", "#1473E6", "#2680EB", "#2D2D2D"],
    fontFamily: "Adobe Clean, Source Sans Pro",
    sectionCount: 4,
    isFeatured: false,
    url: "https://spectrum.adobe.com/page/principles/",
  },
  {
    id: "amazon-cloudscape",
    name: "Amazon Cloudscape",
    badge: "Enterprise Web Standard",
    category: "Cloud Services & Developer Console",
    description:
      "An open-source design system built for AWS cloud products and enterprise web services, featuring dense data tables and accessible UI patterns.",
    edition: "Cloudscape Design System",
    colors: ["#0972D3", "#16191F", "#5F6B7A", "#EC7211"],
    fontFamily: "Open Sans, Amazon Ember",
    sectionCount: 4,
    isFeatured: false,
    url: "https://cloudscape.design/",
  },
  {
    id: "apple",
    name: "Apple Design & Style Guide",
    badge: "Official Reference Standard",
    category: "Human Interface & Operating Systems",
    description:
      "Apple's official Human Interface Guidelines (HIG) and style standards for iOS, iPadOS, macOS, watchOS, and visionOS.",
    edition: "June 2026 Edition",
    colors: ["#000000", "#1D1D1F", "#0071E3", "#FFFFFF"],
    fontFamily: "SF Pro Display, SF Mono",
    sectionCount: 5,
    isFeatured: true,
    url: "https://developer.apple.com/design/",
    internalRoute: "/templates/apple",
  },
  {
    id: "audi",
    name: "Audi Styleguide",
    badge: "Automotive Identity",
    category: "Automotive & Digital Brand UI",
    description:
      "Audi's brand appearance and UI system focusing on progressive mobility, dynamic digital presence, and high-contrast precision.",
    edition: "Audi Corporate & UI Guide",
    colors: ["#BB0A30", "#000000", "#FFFFFF", "#4A4A4A"],
    fontFamily: "Audi Type, Segoe UI",
    sectionCount: 4,
    isFeatured: false,
    url: "https://styleguide.audi.com/document/2865?#/-/ui-introduction",
  },
  {
    id: "bbc-gel",
    name: "BBC GEL",
    badge: "Global Broadcasting",
    category: "Public Broadcasting & Editorial Media",
    description:
      "The BBC Global Experience Language (GEL) creating unified, accessible, and delightful digital experiences across news, audio, and video platforms.",
    edition: "Global Experience Language",
    colors: ["#000000", "#FFD200", "#BB1919", "#FFFFFF"],
    fontFamily: "BBC Reith Sans, BBC Reith Serif",
    sectionCount: 4,
    isFeatured: false,
    url: "https://www.bbc.co.uk/gel",
  },
  {
    id: "github-primer",
    name: "GitHub Primer",
    badge: "Developer Ecosystem",
    category: "Developer Platform & Collaboration Tools",
    description:
      "GitHub's design system powering the world's open-source developer platform with design tokens, Octicons, dark mode scales, and accessible primitives.",
    edition: "Primer Design System",
    colors: ["#24292F", "#0969DA", "#1F883D", "#8250DF"],
    fontFamily: "Mona Sans, Hubot Sans",
    sectionCount: 5,
    isFeatured: false,
    url: "https://primer.style/",
  },
  {
    id: "google-material",
    name: "Google Material 3",
    badge: "Dynamic Color Theming",
    category: "Multi-Platform & Android Ecosystem",
    description:
      "Google's adaptable design system featuring personalized algorithmic color theming, expressive typography, and fluid motion design principles.",
    edition: "Material Design 3",
    colors: ["#4285F4", "#EA4335", "#FBBC05", "#34A853"],
    fontFamily: "Roboto, Google Sans",
    sectionCount: 5,
    isFeatured: false,
    url: "https://m3.material.io/",
  },
  {
    id: "shopify-polaris",
    name: "Shopify Polaris",
    badge: "Global Commerce",
    category: "Merchant Admin & Commerce Workflows",
    description:
      "Shopify's design system crafted to help teams build consistent, merchant-focused commerce workflows, admin dashboards, and accessible UI controls.",
    edition: "Polaris Design System",
    colors: ["#008060", "#202223", "#5C5F62", "#F6F6F7"],
    fontFamily: "Shopify Sans, Inter",
    sectionCount: 4,
    isFeatured: false,
    url: "https://polaris.shopify.com/",
  },
]

export const APPLE_BRAND_GUIDELINES = APPLE_STYLE_GUIDE_DOC
