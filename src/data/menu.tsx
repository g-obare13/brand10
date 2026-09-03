import { IconBrandGithub, IconBrandX, IconGlobe } from "@tabler/icons-react"

export const heroData = {
  title: "One strategic ecosystem for modern digital growth.",
  subtitle: "Design-Led Engineering.",
  ctaText: "Explore services",
  image: "/images/agency/annie-spratt-hCb3lIB8L8E-unsplash.jpg",
}

export const headerData = {
  chatLabel: "Get Started",
  menuLabel: "Chat with Me",
  contactCard: {
    label: "Contact card",
    name: "Obare Geoffrey",
    image: "/portfolio/obare.avif",
    role: "Frontend Engineer & UI/UX Designer | AI Product Interfaces (RAG, LLMs) | React · TypeScript · Figma",
    bio: "Frontend Engineer and UI/UX Designer who builds interfaces for AI-powered products, with hands-on RAG and LLM experience. 7+ years shipping production web apps for fintech, e-commerce, logistics, and SaaS. Open to software engineering roles.",
    email: "obaregeoffrey13@gmail.com",
    phone: "+1 (234) 567-8900",
    socials: [
      { icon: <IconGlobe />, text: "Portfolio", href: "https://obare27.com" },
      {
        icon: <IconBrandGithub />,
        text: "Github",
        href: "https://github.com/g-obare13",
      },
      {
        icon: <IconBrandX />,
        text: "X (Twitter)",
        href: "https://x.com/Black_Gr00t",
      },
    ],
  },
  menuLinks: [
    { label: "Services", href: "/creative-agency/services" },
    { label: "Case Studies", href: "/creative-agency/case-studies" },
    { label: "Insights", href: "/creative-agency/insights" },
    { label: "Contact", href: "/creative-agency/contact" },
  ],
  menuDetails: [
    {
      label: "Inquiries",
      type: "links",
      items: [
        {
          text: "obaregeoffrey13@gmail.com",
          href: "mailto:obaregeoffrey13@gmail.com",
        },
      ],
    },

    {
      label: "Follow Me",
      type: "links",
      items: [
        { text: "X(Twitter)", href: "https://x.com/Black_Gr00t" },
        { text: "Github", href: "https://github.com/g-obare13" },
      ],
    },
  ],
}

export const featuresData = {
  introTitle:
    "Build a digital presence that elevates your brand, customer experience, and revenue.",
  features: [
    {
      number: "01",
      title: "Strategic Brand Systems",
      description:
        "We craft scalable visual identities, messaging frameworks, and digital foundations designed for long-term growth and recognition.",
    },
    {
      number: "02",
      title: "Seamless Digital Experiences",
      description:
        "From websites to product interfaces, we create intuitive experiences that feel premium, effortless, and conversion-focused.",
    },
    {
      number: "03",
      title: "Growth-Driven Execution",
      description:
        "We combine strategy, design, and development to launch high-performing digital products that deliver measurable business impact.",
    },
  ],
  partners: {
    title: "Our Partners",
    logos: [
      { name: "accenture", src: "/images/partners/logoipsum-369.svg" },
      { name: "bain", src: "/images/partners/logoipsum-388.svg" },
      { name: "brevo", src: "/images/partners/logoipsum-398.svg" },
      { name: "deloitte", src: "/images/partners/logoipsum-400.svg" },
      { name: "fedex", src: "/images/partners/logoipsum-402.svg" },
    ],
  },
}

export interface WorkCard {
  brand: string
  slug: string
  description: string
  subtitle?: string
  image: string
  aspect: string
  tags?: Array<string>
  date?: string
  categories?: Array<string>
  title?: string
  challenge?: string
  solution?: string
  stat?: string
}

export const productShowcaseData = {
  label: "Featured Work",
  title: "Design a future so irresistible,\nit becomes inevitable.",
  ctaText: "Explore work",
  works: [
    {
      brand: "BOSE",
      slug: "bose",
      description:
        "Immersive audio experience\nreimagined for the modern listener.",
      subtitle: "Brand Identity · Packaging",
      image: "/images/agency/viktor-forgacs-B88PgQXS4qg-unsplash.jpg",
      aspect: "aspect-[4/5]",
      tags: ["Audio", "Premium"],
      date: "May 5, 2023",
      categories: ["UIUX", "BRANDING", "MOBILE APP", "WEBSITE DESIGN"],
      title: "Bringing your brand to life in the digital world",
      challenge:
        "Redesigning a legacy platform to support immersive user experiences while keeping the brand core intact.",
      solution:
        "Partnered with engineering to implement seamless high-fidelity audio assets and a clean minimalist UI.",
      stat: "Grew by 130%",
    },
    {
      brand: "NEON",
      slug: "neon",
      description: "A futuristic metropolis\nbrought to life through code.",
      subtitle: "Web Experience · 3D",
      image: "/images/agency/mahesh-ranaweera-77kGFhodgyo-unsplash.jpg",
      aspect: "aspect-[3/4]",
      tags: ["Interactive", "3D"],
      categories: ["3D MODELING", "WEBGL", "INTERACTIVE DESIGN"],
      title: "Neon City Interactive WebGL Experience",
      date: "Jan 12, 2023",
      challenge:
        "Bypassing traditional web limitations to launch an interactive 3D virtual environment accessible to all users.",
      solution:
        "Built a WebGL-powered 3D engine with staggered asset loading and fluid camera transitions.",
      stat: "+45% Conversion",
    },
    {
      brand: "KITCHEN",
      slug: "kitchen",
      description: "Everyday essentials\nredefined for modern living.",
      subtitle: "Brand Strategy · Packaging",
      image: "/images/agency/prydumano-design-vIbxvHj9m9g-unsplash.jpg",
      aspect: "aspect-[1/1]",
      tags: ["Retail", "CPG"],
      categories: ["RETAIL BRANDING", "PACKAGING DESIGN", "ECOMMERCE"],
      title: "Kitchen Redesign and Brand Strategy",
      date: "Mar 22, 2023",
      challenge:
        "Recreating the digital marketplace catalog and branding to emphasize modern sustainable materials.",
      solution:
        "Refined product packaging concepts, visual layouts, and implemented a clean modern checkout experience.",
      stat: "+80% Growth",
    },
    {
      brand: "ARCA",
      slug: "arca",
      description: "An original animated series\npushing creative boundaries.",
      subtitle: "Animation · Season One",
      image: "/images/agency/srinivas-bandari-Cr2RPazX5oc-unsplash.jpg",
      aspect: "aspect-[4/5]",
      tags: ["Animation", "Original"],
      categories: ["ANIMATION", "SVG FILTERS", "GSAP HOOKS"],
      title: "Arca Animated Series Platform",
      date: "Apr 30, 2023",
      challenge:
        "Elevating visual storytelling to connect deeply with global audiences and drive subscription sign-ups.",
      solution:
        "Developed a next-generation animation showcase utilizing advanced SVG filters and custom GSAP hooks.",
      stat: "+2.5x Engagement",
    },
  ],
}

export const testimonialsData = [
  {
    name: "Ray Holland",
    role: "CEO, Layer Ventures",
    avatar: "/images/avatars/user2.jpg",
    quote:
      "“OrbitKit didn’t just build our website—they rebuilt our entire brand from the ground up. The strategic thinking, design quality, and technical execution were world-class. We saw a 40% lift in conversions within the first month.”",
  },
  {
    name: "Sarah Jenkins",
    role: "CMO, Bloom Health",
    avatar: "/images/avatars/user1.jpg",
    quote:
      "“We interviewed five agencies before choosing OrbitKit, and it was the best decision we made. They took the time to understand our market, our users, and our goals. The result is a digital experience that truly sets us apart.”",
  },
  {
    name: "Michael Chen",
    role: "Founder, BaseStack",
    avatar: "/images/avatars/user3.jpg",
    quote:
      "“As a founder, I needed a partner who could move fast without sacrificing quality. OrbitKit delivered our MVP in 10 weeks—on budget and exceeding expectations. They're not just vendors; they're strategic partners.”",
  },
]

export const insightsSectionData = {
  title: "Insights.",
  ctaText: "View more",
}

export interface InsightPost {
  title: string
  slug: string
  author: string
  avatar: string
  date: string
  excerpt: string
  image: string
}

export const mediaData: Array<InsightPost> = [
  {
    title: "How We Helped a Fintech Startup Achieve 3x Growth in 6 Months",
    slug: "fintech-startup-growth",
    author: "Carrie Matthews",
    avatar: "/images/avatars/user4.jpg",
    date: "06 Jan 2022",
    excerpt:
      "A deep dive into our end-to-end partnership with a fintech startup—from brand identity to product launch. We break down the strategy, design decisions, and development process that led to $12M in funding.",
    image: "/images/agency/diego-ph-fIq0tET6llw-unsplash.jpg",
  },
  {
    title: "The Playbook: Building Digital Products That Users Actually Love",
    slug: "building-digital-products",
    author: "Warren Rhodes",
    avatar: "/images/avatars/user5.jpg",
    date: "17 Apr 2022",
    excerpt:
      "Our design and development methodology, distilled. From discovery workshops to post-launch optimization, learn how we create digital products that drive real engagement and business results.",
    image: "/images/agency/johnson-wang-iI4sR_nkkbc-unsplash.jpg",
  },
  {
    title: "Why Brand Strategy Matters More Than Ever in a Crowded Market",
    slug: "why-brand-strategy-matters",
    author: "Pearl Manning",
    avatar: "/images/avatars/user6.jpg",
    date: "16 Jun 2022",
    excerpt:
      "In a landscape where every brand is competing for attention, a strong identity isn't optional—it's survival. We share our framework for building brands that stand out, connect, and convert.",
    image: "/images/agency/look-studio-oZWR_Invx7s-unsplash.jpg",
  },
  {
    title: "The Art of Minimalist UI: Less is More in Modern Design",
    slug: "art-of-minimalist-ui",
    author: "Diana Prince",
    avatar: "/images/avatars/user1.jpg",
    date: "12 Oct 2022",
    excerpt:
      "Why simplicity is key to user satisfaction and high conversions. We break down the principles of minimalist interface design and how to apply them to your digital product.",
    image: "/images/agency/mahesh-ranaweera-77kGFhodgyo-unsplash.jpg",
  },
  {
    title: "Scaling Web App Performance for Global Audiences",
    slug: "scaling-web-app-performance",
    author: "Bruce Wayne",
    avatar: "/images/avatars/user2.jpg",
    date: "24 Nov 2022",
    excerpt:
      "An in-depth look at our technical workflow for building fast, secure, and globally distributed web applications that load in under 1 second.",
    image: "/images/agency/prydumano-design-vIbxvHj9m9g-unsplash.jpg",
  },
  {
    title: "Mastering the Launch: A Guide to Product Hunt and Beyond",
    slug: "mastering-the-product-launch",
    author: "Clark Kent",
    avatar: "/images/avatars/user3.jpg",
    date: "08 Dec 2022",
    excerpt:
      "How to orchestrate a successful public launch for your software product. Learn our framework for marketing, community engagement, and server capacity planning.",
    image: "/images/agency/srinivas-bandari-Cr2RPazX5oc-unsplash.jpg",
  },
]

export const ecosystemData = {
  partners: [
    {
      title: "Ready to scale\nyour brand?",
      buttonText: "Start a Project",
      buttonLink: "#",
      image: "/images/agency/kelly-sikkema-Dx1b5ucschA-unsplash.jpg",
      theme: "light",
    },
    {
      title: "Let's build something\ngreat together",
      buttonText: "Book a Call",
      buttonLink: "#",
      image: "/images/agency/krisztian-tabori-IyaNci0CyRk-unsplash.jpg",
      theme: "dark",
    },
  ],
  compatibility: {
    title: "Our Partners",
    logos: [
      { name: "accenture", src: "/images/partners/accenture.png" },
      { name: "bain", src: "/images/partners/bain.png" },
      { name: "brevo", src: "/images/partners/brevo.png" },
      { name: "deloitte", src: "/images/partners/deloitte.png" },
      { name: "fedex", src: "/images/partners/fedex.png" },
    ],
  },
}

export const faqData = {
  title: "Everything you need to know about Brand10.",
  description:
    "Explore how our AI brand studio generates living design systems, calculates mathematical clearspace rules, and exports production-ready brand decks.",
  cta: {
    label: "Contact Support",
    href: "#",
  },
  items: [
    {
      question:
        "What is Brand10 and how does it automate brand identity creation?",
      answer:
        "Brand10 is an AI-powered brand studio and living design system engine. It transforms raw vector marks, color concepts, and typography choices into comprehensive design systems with automatic clearspace rules, WCAG-compliant color palettes, and interactive mockup sandboxes.",
    },
    {
      question:
        "How does the automated logo clearspace and exclusion zone calculator work?",
      answer:
        "When you upload an SVG or vector mark, Brand10 computes the geometric bounding box and exclusion coordinates based on key proportional landmarks like mark height. It calculates exact safety margins and flags forbidden alterations such as improper rotation or low-contrast surfaces.",
    },
    {
      question:
        "Are generated color palettes tested for accessibility and WCAG standards?",
      answer:
        "Yes. Brand10 evaluates every primary, secondary, and semantic surface against light and dark backgrounds using WCAG 2.1 AA and AAA contrast ratios. It flags failing combinations and automatically suggests accessible tints and shades to ensure compliance across all digital interfaces.",
    },
    {
      question:
        "Can I export design tokens for engineering and PDF guideline decks for clients?",
      answer:
        "Yes. You can export complete design token sets in CSS Custom Properties, Tailwind CSS configuration, and Figma Tokens JSON. You can also generate and download publication-ready, multi-page PDF brand guidelines decks with a single click.",
    },
    {
      question:
        "What is the Mockup Sandbox and how does real-time token sync work?",
      answer:
        "The Mockup Sandbox lets you preview how your brand looks across physical stationery, digital product interfaces, outdoor signage, and apparel. Any adjustment you make to colors, typography, or logo placement instantly synchronizes across all mockups simultaneously.",
    },
    {
      question:
        "Can I customize the generated design systems and add custom brand rules?",
      answer:
        "Every aspect of your system is fully customizable. While Brand10 establishes mathematically sound defaults, you have granular control to refine hex codes, tweak modular type scales, adjust spacing curves, and define custom brand voice rules.",
    },
  ],
}

export interface ServiceItem {
  title: string
  slug: string
  description: string
  iconName: string
}

export const servicesSectionData: Array<ServiceItem> = [
  {
    title: "Sales Management",
    slug: "sales-management",
    description:
      "Optimize conversion funnels, pipeline automation, and strategic lead nurturing systems to accelerate revenue growth.",
    iconName: "IconTrendingUp",
  },
  {
    title: "Data Analytics",
    slug: "data-analytics",
    description:
      "Implement behavior tracking, custom dashboards, and performance analysis to unlock actionable, data-driven decisions.",
    iconName: "IconChartBar",
  },
  {
    title: "Brand Strategy & Design",
    slug: "brand-strategy-design",
    description:
      "Develop cohesive brand systems, positioning models, and premium visual identities that resonate and scale.",
    iconName: "IconPalette",
  },
  {
    title: "Web & App Development",
    slug: "web-app-development",
    description:
      "Build fast, secure, and accessible digital products leveraging modern frontend/backend frameworks and clean code.",
    iconName: "IconDeviceLaptop",
  },
  {
    title: "SEO & Content Strategy",
    slug: "seo-content-strategy",
    description:
      "Drive organic traffic and authority with search-optimized content, technical SEO Audits, and performance marketing.",
    iconName: "IconSearch",
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "Launch targeted marketing campaigns, manage paid advertising, and leverage social proof to scale customer acquisition.",
    iconName: "IconShare",
  },
]

export const statsData = {
  stats: [
    {
      value: 1000000,
      suffix: "+",
      label: "Deliverables shipped across client projects",
    },
    {
      value: 50000,
      suffix: "+",
      label: "Hours of design and engineering logged",
    },
    {
      value: 150,
      suffix: "+",
      label: "Clients served across industries and markets",
    },
  ],
}

export const contactData = {
  title: "Contact our team",
  description:
    "Got any questions about the product or scaling on our platform? We're here to help. Chat to our friendly team 24/7 and get onboard in less than 5 minutes.",
  details: {
    chat: {
      title: "Chat with us",
      description: "Speak to our friendly team via live chat.",
      links: [
        { text: "Start a live chat", href: "#" },
        { text: "Shoot us an email", href: "#" },
      ],
    },
    call: {
      title: "Call us",
      description: "Call our team Mon-Fri from 8am to 5pm.",
      number: "+1 (555) 000-0000",
      href: "#",
    },
    visit: {
      title: "Visit us",
      description: "Chat to us in person at our Melbourne HQ.",
      address: "100 Smith Street, Collingwood VIC 3066",
      href: "#",
    },
  },
}

export const seoPresets = {
  default: {
    title: "OrbitKit | Strategic Digital Creative Agency",
    description:
      "OrbitKit is a strategic creative agency blending premium design with high-end engineering to deliver measurable digital growth.",
    keywords:
      "creative agency, design agency, brand strategy, web development, UI/UX design, growth marketing, OrbitKit",
  },
  services: {
    title: "Our Services | OrbitKit Creative Agency",
    description:
      "Explore our comprehensive creative services: Brand Strategy, Web & App Development, SEO, and Digital Marketing designed to scale your business.",
    keywords:
      "creative agency services, web development, UI/UX design, brand identity, SEO agency",
  },
  caseStudies: {
    title: "Case Studies | OrbitKit Creative Agency",
    description:
      "Read about how OrbitKit partners with leading companies to build brand value, improve digital products, and drive exponential growth.",
    keywords:
      "creative case studies, design portfolio, branding portfolio, software development success",
  },
  insights: {
    title: "Insights & Articles | OrbitKit Creative Agency",
    description:
      "Articles, design reviews, technology logs, and brand strategies written by OrbitKit's design and engineering teams.",
    keywords:
      "design articles, brand strategy blog, software engineering blog, design system design",
  },
  contact: {
    title: "Contact Us | OrbitKit Creative Agency",
    description:
      "Get in touch with OrbitKit's experts to start a project, book a strategic consultation, or learn more about our capabilities.",
    keywords:
      "hire creative agency, brand consultant, contact web design agency",
  },
}

export interface ServiceDetailConfig {
  title: string
  imageSrc: string
  imageAlt: string
  imagePosition: "left" | "right"
  footerTitle: string
  footerDescription: string
  buttonText: string
}

export const serviceDetailsData: Record<string, ServiceDetailConfig> = {
  "sales-management": {
    title:
      "Optimize conversion funnels and automated lead generation workflows.",
    imageSrc: "/images/agency/annie-spratt-hCb3lIB8L8E-unsplash.jpg",
    imageAlt: "Sales Management Systems",
    imagePosition: "left",
    footerTitle: "01 - Sales Management",
    footerDescription:
      "Optimize conversion funnels, pipeline automation, and strategic lead nurturing systems to accelerate revenue growth.",
    buttonText: "Supercharge your pipeline",
  },
  "data-analytics": {
    title: "Turn user behavior into clear dashboards and actionable insights.",
    imageSrc: "/images/agency/cherrydeck-rMILC1PIwM0-unsplash.jpg",
    imageAlt: "Data Analytics Systems",
    imagePosition: "right",
    footerTitle: "02 - Data Analytics",
    footerDescription:
      "Implement behavior tracking, custom dashboards, and performance analysis to unlock actionable, data-driven decisions.",
    buttonText: "Explore our insights",
  },
  "brand-strategy-design": {
    title:
      "Scalable identities and digital foundations built for recognition and long-term growth.",
    imageSrc: "/images/agency/annie-spratt-hCb3lIB8L8E-unsplash.jpg",
    imageAlt: "Strategic Brand Systems",
    imagePosition: "left",
    footerTitle: "03 - Strategic Brand Systems",
    footerDescription:
      "We craft scalable visual identities, messaging frameworks, and digital foundations designed for long-term growth and recognition.",
    buttonText: "Build your foundation",
  },
  "web-app-development": {
    title: "Premium, intuitive interfaces built to convert and built to last.",
    imageSrc: "/images/agency/cherrydeck-rMILC1PIwM0-unsplash.jpg",
    imageAlt: "Seamless Digital Experiences",
    imagePosition: "right",
    footerTitle: "04 - Seamless Digital Experiences",
    footerDescription:
      "From websites to product interfaces, we create intuitive experiences that feel premium, effortless, and conversion-focused.",
    buttonText: "See our work",
  },
  "seo-content-strategy": {
    title:
      "Drive organic search volume and domain authority with technical optimization.",
    imageSrc: "/images/agency/johnson-wang-iI4sR_nkkbc-unsplash.jpg",
    imageAlt: "SEO and Performance content",
    imagePosition: "left",
    footerTitle: "05 - SEO & Content Strategy",
    footerDescription:
      "Drive organic traffic and authority with search-optimized content, technical SEO Audits, and performance marketing.",
    buttonText: "Audit your search positioning",
  },
  "digital-marketing": {
    title:
      "Strategy, design, and development combined to ship products that perform.",
    imageSrc: "/images/agency/johnson-wang-iI4sR_nkkbc-unsplash.jpg",
    imageAlt: "Growth-Driven Execution",
    imagePosition: "left",
    footerTitle: "06 - Growth-Driven Execution",
    footerDescription:
      "We combine strategy, design, and development to launch high-performing digital products that deliver measurable business impact.",
    buttonText: "Launch with us",
  },
}

export interface ServiceTabItem {
  title: string
  description: string
  images: [string, string, string]
}

export interface ServiceFeaturesTabsConfig {
  title: string
  tabs: Array<ServiceTabItem>
}

export const serviceFeaturesTabsData: Record<
  string,
  ServiceFeaturesTabsConfig
> = {
  "sales-management": {
    title: "Streamline customer journeys and optimize conversion pipelines.",
    tabs: [
      {
        title: "Conversion Funnels",
        description:
          "Analyze and optimize each stage of your conversion funnel to eliminate drop-offs and maximize client acquisition rates.",
        images: [
          "/images/agency/brooke-cagle--uHVRvDr7pg-unsplash.jpg",
          "/images/agency/kelly-sikkema-Dx1b5ucschA-unsplash.jpg",
          "/images/agency/look-studio-oZWR_Invx7s-unsplash.jpg",
        ],
      },
      {
        title: "Pipeline Automation",
        description:
          "Automate manual sales activities and lead routing to ensure your team focuses on high-value, high-intent opportunities.",
        images: [
          "/images/agency/krisztian-tabori-IyaNci0CyRk-unsplash.jpg",
          "/images/agency/prydumano-design-vIbxvHj9m9g-unsplash.jpg",
          "/images/agency/annie-spratt-hCb3lIB8L8E-unsplash.jpg",
        ],
      },
      {
        title: "Lead Nurturing",
        description:
          "Engage prospects automatically with personalized email sequences, smart retargeting, and contextual content marketing.",
        images: [
          "/images/agency/look-studio-oZWR_Invx7s-unsplash.jpg",
          "/images/agency/brooke-cagle--uHVRvDr7pg-unsplash.jpg",
          "/images/agency/cherrydeck-rMILC1PIwM0-unsplash.jpg",
        ],
      },
      {
        title: "Analytics Integration",
        description:
          "Gain full visibility into pipeline health with real-time performance indicators and executive reporting dashboards.",
        images: [
          "/images/agency/krisztian-tabori-IyaNci0CyRk-unsplash.jpg",
          "/images/agency/diego-ph-fIq0tET6llw-unsplash.jpg",
          "/images/agency/viktor-forgacs-B88PgQXS4qg-unsplash.jpg",
        ],
      },
    ],
  },
  "data-analytics": {
    title: "Decipher user behavior to make confident, data-driven decisions.",
    tabs: [
      {
        title: "Behavior Tracking",
        description:
          "Track user journeys across web and mobile platforms with event-based instrumentation and visual click maps.",
        images: [
          "/images/agency/krisztian-tabori-IyaNci0CyRk-unsplash.jpg",
          "/images/agency/kelly-sikkema-Dx1b5ucschA-unsplash.jpg",
          "/images/agency/look-studio-oZWR_Invx7s-unsplash.jpg",
        ],
      },
      {
        title: "Custom Dashboards",
        description:
          "Consolidate complex data into intuitive, real-time visualization panels for cross-functional alignment.",
        images: [
          "/images/agency/prydumano-design-vIbxvHj9m9g-unsplash.jpg",
          "/images/agency/annie-spratt-hCb3lIB8L8E-unsplash.jpg",
          "/images/agency/cherrydeck-rMILC1PIwM0-unsplash.jpg",
        ],
      },
      {
        title: "Funnel Analysis",
        description:
          "Isolate product bottlenecks and optimize drop-off steps with cohort mapping and multivariate testing.",
        images: [
          "/images/agency/brooke-cagle--uHVRvDr7pg-unsplash.jpg",
          "/images/agency/krisztian-tabori-IyaNci0CyRk-unsplash.jpg",
          "/images/agency/look-studio-oZWR_Invx7s-unsplash.jpg",
        ],
      },
      {
        title: "Predictive Modeling",
        description:
          "Model customer lifetime value and churn probability using historical trends and machine learning heuristics.",
        images: [
          "/images/agency/diego-ph-fIq0tET6llw-unsplash.jpg",
          "/images/agency/viktor-forgacs-B88PgQXS4qg-unsplash.jpg",
          "/images/agency/annie-spratt-hCb3lIB8L8E-unsplash.jpg",
        ],
      },
    ],
  },
  "brand-strategy-design": {
    title:
      "Create iconic brand identities that resonate with your target audience.",
    tabs: [
      {
        title: "Visual Identity",
        description:
          "Craft modern logos, typography systems, and cohesive color palettes that elevate and define your brand positioning.",
        images: [
          "/images/agency/cherrydeck-rMILC1PIwM0-unsplash.jpg",
          "/images/agency/prydumano-design-vIbxvHj9m9g-unsplash.jpg",
          "/images/agency/annie-spratt-hCb3lIB8L8E-unsplash.jpg",
        ],
      },
      {
        title: "Brand Systems",
        description:
          "Design comprehensive brand books and design system guidelines to ensure consistent execution across all channels.",
        images: [
          "/images/agency/kelly-sikkema-Dx1b5ucschA-unsplash.jpg",
          "/images/agency/brooke-cagle--uHVRvDr7pg-unsplash.jpg",
          "/images/agency/look-studio-oZWR_Invx7s-unsplash.jpg",
        ],
      },
      {
        title: "Product Styling",
        description:
          "Apply brand DNA seamlessly onto physical packaging, merchandise, and premium high-fidelity digital interfaces.",
        images: [
          "/images/agency/srinivas-bandari-Cr2RPazX5oc-unsplash.jpg",
          "/images/agency/viktor-forgacs-B88PgQXS4qg-unsplash.jpg",
          "/images/agency/diego-ph-fIq0tET6llw-unsplash.jpg",
        ],
      },
      {
        title: "Brand Positioning",
        description:
          "Define your market value proposition, voice directives, and messaging architecture to outpace competitors.",
        images: [
          "/images/agency/look-studio-oZWR_Invx7s-unsplash.jpg",
          "/images/agency/brooke-cagle--uHVRvDr7pg-unsplash.jpg",
          "/images/agency/krisztian-tabori-IyaNci0CyRk-unsplash.jpg",
        ],
      },
    ],
  },
  "web-app-development": {
    title:
      "Build custom digital products powered by modern engineering stacks.",
    tabs: [
      {
        title: "Custom React Apps",
        description:
          "Develop fast, responsive single page applications and server-side rendered platforms using modern frontend frameworks.",
        images: [
          "/images/agency/krisztian-tabori-IyaNci0CyRk-unsplash.jpg",
          "/images/agency/annie-spratt-hCb3lIB8L8E-unsplash.jpg",
          "/images/agency/prydumano-design-vIbxvHj9m9g-unsplash.jpg",
        ],
      },
      {
        title: "Headless Architecture",
        description:
          "Deploy decoupled headless CMS platforms with robust GraphQL or REST APIs for global content distribution.",
        images: [
          "/images/agency/diego-ph-fIq0tET6llw-unsplash.jpg",
          "/images/agency/viktor-forgacs-B88PgQXS4qg-unsplash.jpg",
          "/images/agency/cherrydeck-rMILC1PIwM0-unsplash.jpg",
        ],
      },
      {
        title: "Performance Tuning",
        description:
          "Achieve perfect Lighthouse performance metrics with serverless deployment strategies and asset caching pipelines.",
        images: [
          "/images/agency/kelly-sikkema-Dx1b5ucschA-unsplash.jpg",
          "/images/agency/krisztian-tabori-IyaNci0CyRk-unsplash.jpg",
          "/images/agency/brooke-cagle--uHVRvDr7pg-unsplash.jpg",
        ],
      },
      {
        title: "Security & Cloud hosting",
        description:
          "Deploy multi-zone cloud solutions on AWS or Vercel, fortified with encrypted databases and secure API design.",
        images: [
          "/images/agency/muhammad-salim-DG_Sm6PCKGM-unsplash.jpg",
          "/images/agency/look-studio-oZWR_Invx7s-unsplash.jpg",
          "/images/agency/srinivas-bandari-Cr2RPazX5oc-unsplash.jpg",
        ],
      },
    ],
  },
  "seo-content-strategy": {
    title: "Secure search engine supremacy and establish digital authority.",
    tabs: [
      {
        title: "Technical Audits",
        description:
          "Optimize site crawlability, sitemaps, semantic markups, and core web vitals to win top search rankings.",
        images: [
          "/images/agency/krisztian-tabori-IyaNci0CyRk-unsplash.jpg",
          "/images/agency/kelly-sikkema-Dx1b5ucschA-unsplash.jpg",
          "/images/agency/brooke-cagle--uHVRvDr7pg-unsplash.jpg",
        ],
      },
      {
        title: "Keyword Intelligence",
        description:
          "Discover high-converting, search-intent-driven keywords to design your editorial roadmap.",
        images: [
          "/images/agency/look-studio-oZWR_Invx7s-unsplash.jpg",
          "/images/agency/annie-spratt-hCb3lIB8L8E-unsplash.jpg",
          "/images/agency/cherrydeck-rMILC1PIwM0-unsplash.jpg",
        ],
      },
      {
        title: "Content Engineering",
        description:
          "Create premium, copywriter-crafted articles and interactive resources optimized for readability and organic growth.",
        images: [
          "/images/agency/brooke-cagle--uHVRvDr7pg-unsplash.jpg",
          "/images/agency/prydumano-design-vIbxvHj9m9g-unsplash.jpg",
          "/images/agency/srinivas-bandari-Cr2RPazX5oc-unsplash.jpg",
        ],
      },
      {
        title: "Link Building",
        description:
          "Build domain authority and trusted traffic links via strategic digital PR and placement outreach.",
        images: [
          "/images/agency/muhammad-salim-DG_Sm6PCKGM-unsplash.jpg",
          "/images/agency/diego-ph-fIq0tET6llw-unsplash.jpg",
          "/images/agency/viktor-forgacs-B88PgQXS4qg-unsplash.jpg",
        ],
      },
    ],
  },
  "digital-marketing": {
    title:
      "Execute targeted digital campaigns that convert intent into revenue.",
    tabs: [
      {
        title: "Performance Marketing",
        description:
          "Deploy and optimize high-converting paid search and social campaigns across major ad networks.",
        images: [
          "/images/agency/look-studio-oZWR_Invx7s-unsplash.jpg",
          "/images/agency/krisztian-tabori-IyaNci0CyRk-unsplash.jpg",
          "/images/agency/brooke-cagle--uHVRvDr7pg-unsplash.jpg",
        ],
      },
      {
        title: "Social Growth",
        description:
          "Build organic presence and trust with consistent storytelling, engaging video formats, and community management.",
        images: [
          "/images/agency/johnson-wang-iI4sR_nkkbc-unsplash.jpg",
          "/images/agency/annie-spratt-hCb3lIB8L8E-unsplash.jpg",
          "/images/agency/cherrydeck-rMILC1PIwM0-unsplash.jpg",
        ],
      },
      {
        title: "Conversion Audits",
        description:
          "Increase website signups and checkout metrics using statistical A/B testing and behavioral heatmaps.",
        images: [
          "/images/agency/kelly-sikkema-Dx1b5ucschA-unsplash.jpg",
          "/images/agency/prydumano-design-vIbxvHj9m9g-unsplash.jpg",
          "/images/agency/diego-ph-fIq0tET6llw-unsplash.jpg",
        ],
      },
      {
        title: "Retention Strategies",
        description:
          "Optimize lifetime value with automated lifecycle marketing and personalized loyalty sequences.",
        images: [
          "/images/agency/look-studio-oZWR_Invx7s-unsplash.jpg",
          "/images/agency/srinivas-bandari-Cr2RPazX5oc-unsplash.jpg",
          "/images/agency/viktor-forgacs-B88PgQXS4qg-unsplash.jpg",
        ],
      },
    ],
  },
}

export const footerData = {
  logo: "ORBITKIT",
  slogan: "Digital Growth Partners",
  address: "New York, US\nOperating globally",
  newsletter: {
    title: "Stay in the loop.",
    description:
      "Get insights on brand strategy, design trends, and digital growth delivered to your inbox.",
    placeholder: "Email address",
  },
  links: [
    {
      title: "Company",
      items: [
        { label: "About", href: "#" },
        { label: "Work", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Careers", href: "#" },
      ],
    },
    {
      title: "Services",
      items: [
        { label: "Brand Strategy", href: "#" },
        { label: "Web Development", href: "#" },
        { label: "UI/UX Design", href: "#" },
        { label: "Digital Marketing", href: "#" },
      ],
    },
    {
      title: "Resources",
      items: [
        { label: "Case Studies", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Process", href: "#" },
      ],
    },
  ],
  socials: [
    { name: "LinkedIn", href: "#" },
    { name: "Facebook", href: "#" },
    { name: "Twitter", href: "#" },
  ],
  copyright: "Copyright © 2026 Brand10. All Rights Reserved.",
}
