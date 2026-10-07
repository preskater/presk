export interface NavLink {
  title: string
  href: string
  description?: string
}

export interface NavColumn {
  title: string
  links: NavLink[]
}

export const productNav: NavColumn = {
  title: "Product",
  links: [
    {
      title: "Projects",
      href: "/features",
      description: "Kanban boards, tasks and progress",
    },
    {
      title: "Messaging",
      href: "/features",
      description: "Channels, threads and direct messages",
    },
    {
      title: "Calendars",
      href: "/features",
      description: "Team scheduling and availability",
    },
    {
      title: "Files",
      href: "/features",
      description: "Documents, sharing and permissions",
    },
  ],
}

export const solutionNav: NavColumn = {
  title: "Solutions",
  links: [
    { title: "Engineering", href: "/features", description: "Ship faster together" },
    { title: "Design", href: "/features", description: "Keep work in sync" },
    { title: "Operations", href: "/features", description: "Run the business" },
    { title: "Startups", href: "/pricing", description: "Scale from day one" },
  ],
}

export const resourceNav: NavColumn = {
  title: "Resources",
  links: [
    { title: "Documentation", href: "/faq", description: "Guides and references" },
    { title: "Blog", href: "/blog", description: "Product updates" },
    { title: "Community", href: "/blog", description: "Join the conversation" },
    { title: "Support", href: "/faq", description: "We're here to help" },
  ],
}

export const companyNav: NavColumn = {
  title: "Company",
  links: [
    { title: "About", href: "/about", description: "Our mission and team" },
    { title: "Careers", href: "/careers", description: "Join the team" },
    { title: "Contact", href: "/contact", description: "Talk to sales" },
    { title: "Pricing", href: "/pricing", description: "Plans and billing" },
  ],
}

export const logos = [
  "Northwind",
  "Acme Corp",
  "Globex",
  "Initech",
  "Umbrella",
  "Hooli",
]

export interface Feature {
  icon: "zap" | "users" | "calendar" | "folder" | "message" | "shield"
  title: string
  description: string
}

export const features: Feature[] = [
  {
    icon: "zap",
    title: "AI-native workflows",
    description:
      "Automate standups, summaries and task updates so your team stays focused on the work that matters.",
  },
  {
    icon: "users",
    title: "Everything in one place",
    description:
      "Projects, messaging, calendars and files share the same people, context and permissions.",
  },
  {
    icon: "shield",
    title: "Enterprise-grade security",
    description:
      "Organizations, roles and granular permissions built in — with SSO-ready authentication.",
  },
  {
    icon: "calendar",
    title: "Scheduling that just works",
    description:
      "See team availability, schedule meetings and sync events across every calendar view.",
  },
  {
    icon: "folder",
    title: "Files with real permissions",
    description:
      "Share documents with view, comment or edit access — down to the individual file.",
  },
  {
    icon: "message",
    title: "Conversations with context",
    description:
      "Threads, reactions and mentions keep discussions attached to the work they're about.",
  },
]

export interface ShowcaseTab {
  value: string
  label: string
  heading: string
  description: string
}

export const showcaseTabs: ShowcaseTab[] = [
  {
    value: "projects",
    label: "Projects",
    heading: "Plan and ship with Kanban boards",
    description:
      "Organize work into boards, track progress and keep every task tied to the people and files it touches.",
  },
  {
    value: "messages",
    label: "Messages",
    heading: "Chat that stays in context",
    description:
      "Channels, direct messages and threads keep your team aligned without losing the thread.",
  },
  {
    value: "calendars",
    label: "Calendars",
    heading: "One calendar for the whole team",
    description:
      "Schedule across projects with shared availability, reminders and meeting cards.",
  },
  {
    value: "files",
    label: "Files",
    heading: "Documents with real permissions",
    description:
      "Store, preview and share files with granular access — right next to your projects.",
  },
]

export interface Testimonial {
  quote: string
  name: string
  role: string
  initials: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Presk replaced four tools for us. Projects, chat and files finally live in the same place, so context never gets lost.",
    name: "Aria Chen",
    role: "Head of Product, Northwind",
    initials: "AC",
  },
  {
    quote:
      "The AI assistants handle the busywork — standups, summaries, task updates. My team got a full day back every week.",
    name: "Marcus Reid",
    role: "Engineering Lead, Globex",
    initials: "MR",
  },
  {
    quote:
      "Permissions and organizations were ready out of the box. We rolled it out to 200 people in an afternoon.",
    name: "Priya Nair",
    role: "COO, Initech",
    initials: "PN",
  },
  {
    quote:
      "It feels like a single product instead of a bundle. The calendar and files are as good as the project boards.",
    name: "Lena Fischer",
    role: "Design Director, Umbrella",
    initials: "LF",
  },
]

export interface PricingTier {
  name: string
  monthly: number
  yearly: number
  description: string
  features: string[]
  featured?: boolean
  cta: string
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    monthly: 0,
    yearly: 0,
    description: "For individuals and small teams getting started.",
    features: [
      "Up to 5 members",
      "Projects and tasks",
      "Messaging and threads",
      "1 GB of file storage",
    ],
    cta: "Start for free",
  },
  {
    name: "Team",
    monthly: 12,
    yearly: 10,
    description: "For growing teams that need it all.",
    features: [
      "Unlimited members",
      "Calendars and availability",
      "AI assistants",
      "100 GB of file storage",
      "Granular permissions",
    ],
    featured: true,
    cta: "Start 14-day trial",
  },
  {
    name: "Enterprise",
    monthly: 0,
    yearly: 0,
    description: "For organizations with advanced needs.",
    features: [
      "Everything in Team",
      "SSO and SCIM",
      "Audit log and retention",
      "Unlimited storage",
      "Dedicated support",
    ],
    cta: "Contact sales",
  },
]

export interface FaqItem {
  value: string
  question: string
  answer: string
}

export const faqs: FaqItem[] = [
  {
    value: "free",
    question: "How does the free plan work?",
    answer:
      "The Starter plan is free forever for up to 5 members and includes projects, tasks, messaging and 1 GB of storage. No credit card required.",
  },
  {
    value: "trial",
    question: "What happens after the trial?",
    answer:
      "Your Team trial lasts 14 days. When it ends you can pick a plan or drop back to Starter — your data stays intact either way.",
  },
  {
    value: "ai",
    question: "How do the AI assistants fit in?",
    answer:
      "Assistants live inside your workspace. They can summarize threads, draft task updates and answer questions about your projects, files and calendar.",
  },
  {
    value: "security",
    question: "Is my data secure?",
    answer:
      "Yes. Data is encrypted in transit and at rest, and organizations include role-based access control. Enterprise adds SSO, SCIM and audit logging.",
  },
  {
    value: "migrate",
    question: "Can I import from other tools?",
    answer:
      "You can bring your team over quickly — invite members by email and import projects, files and calendars from common tools.",
  },
]

export const footerColumns: { title: string; links: { title: string; href: string }[] }[] =
  [
    {
      title: "Product",
      links: [
        { title: "Features", href: "/features" },
        { title: "Pricing", href: "/pricing" },
        { title: "FAQ", href: "/faq" },
        { title: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Company",
      links: [
        { title: "About", href: "/about" },
        { title: "Careers", href: "/careers" },
        { title: "Contact", href: "/contact" },
        { title: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Resources",
      links: [
        { title: "Documentation", href: "/faq" },
        { title: "Support", href: "/faq" },
        { title: "Community", href: "/blog" },
        { title: "Changelog", href: "/blog" },
      ],
    },
    {
      title: "Legal",
      links: [
        { title: "Privacy", href: "/legal/privacy" },
        { title: "Terms", href: "/legal/terms" },
        { title: "Security", href: "/legal/security" },
        { title: "Cookies", href: "/legal/cookies" },
      ],
    },
  ]

export const companyValues: { title: string; description: string }[] = [
  {
    title: "Default to clarity",
    description:
      "We build tools that make the state of the work obvious, so teams spend less time asking and more time doing.",
  },
  {
    title: "AI as a teammate",
    description:
      "Assistants should handle the busywork — summaries, updates and follow-ups — so people can focus on judgement.",
  },
  {
    title: "One workspace",
    description:
      "Context shouldn't live in five tabs. Projects, chat, calendar and files belong together.",
  },
]

export const companyStats: { value: string; label: string }[] = [
  { value: "2019", label: "Founded" },
  { value: "48", label: "Team members" },
  { value: "6", label: "Countries" },
  { value: "12k+", label: "Teams onboarded" },
]

export interface Job {
  id: string
  title: string
  team: string
  location: string
  type: string
}

export const jobs: Job[] = [
  {
    id: "senior-frontend",
    title: "Senior Frontend Engineer",
    team: "Engineering",
    location: "Remote (EU)",
    type: "Full-time",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    team: "Design",
    location: "Berlin",
    type: "Full-time",
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    team: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
  },
  {
    id: "customer-success",
    title: "Customer Success Manager",
    team: "Operations",
    location: "New York",
    type: "Full-time",
  },
]

export const contactChannels: { title: string; description: string; detail: string }[] =
  [
    {
      title: "Sales",
      description: "Talk to our team about plans and onboarding.",
      detail: "sales@presk.app",
    },
    {
      title: "Support",
      description: "Get help from a product specialist.",
      detail: "support@presk.app",
    },
    {
      title: "Careers",
      description: "Questions about working at Presk.",
      detail: "careers@presk.app",
    },
  ]

