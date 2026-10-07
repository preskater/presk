export interface LegalSection {
  heading: string
  body: string[]
}

export interface LegalDocument {
  slug: string
  title: string
  description: string
  updated: string
  sections: LegalSection[]
}

export const legalDocuments: Record<string, LegalDocument> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How Presk collects, uses and protects your data.",
    updated: "October 1, 2026",
    sections: [
      {
        heading: "Information we collect",
        body: [
          "We collect the information you provide when you create an account, including your name, email address and organization details.",
          "We also collect usage data — such as the features you interact with — to operate, secure and improve the service.",
        ],
      },
      {
        heading: "How we use information",
        body: [
          "We use your information to provide the service, authenticate users, respond to support requests and send product updates you have opted into.",
          "We never sell your personal data.",
        ],
      },
      {
        heading: "Data retention",
        body: [
          "We retain personal data for as long as your account is active. When you delete your account, we remove or anonymize your data within 30 days, except where we are required to retain it by law.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "Depending on your location, you may have the right to access, correct, export or delete your personal data. Contact privacy@presk.app to exercise these rights.",
        ],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    description: "The agreement that governs your use of Presk.",
    updated: "October 1, 2026",
    sections: [
      {
        heading: "Acceptance of terms",
        body: [
          "By accessing or using Presk, you agree to be bound by these terms. If you use the service on behalf of an organization, you represent that you have authority to bind that organization.",
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "You agree not to misuse the service, including by attempting to access it by any means other than the interfaces we provide, or by using it to store or share unlawful content.",
        ],
      },
      {
        heading: "Subscriptions and billing",
        body: [
          "Paid plans renew automatically unless cancelled. Fees are non-refundable except where required by law. You are responsible for any taxes associated with your subscription.",
        ],
      },
      {
        heading: "Termination",
        body: [
          "You may stop using the service at any time. We may suspend or terminate access if you violate these terms or if required to protect the service or other users.",
        ],
      },
    ],
  },
  security: {
    slug: "security",
    title: "Security",
    description: "How we keep your workspace safe.",
    updated: "October 1, 2026",
    sections: [
      {
        heading: "Encryption",
        body: [
          "Data is encrypted in transit with TLS and at rest with AES-256. OAuth tokens are encrypted at the application layer.",
        ],
      },
      {
        heading: "Access control",
        body: [
          "Organizations include role-based access control, and Enterprise plans add SSO, SCIM provisioning and audit logging.",
        ],
      },
      {
        heading: "Infrastructure",
        body: [
          "We run on hardened cloud infrastructure with continuous monitoring, automated backups and least-privilege access for our own team.",
        ],
      },
      {
        heading: "Responsible disclosure",
        body: [
          "If you believe you have found a vulnerability, please report it to security@presk.app. We investigate every report and will credit researchers who ask to be named.",
        ],
      },
    ],
  },
  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    description: "How and why Presk uses cookies.",
    updated: "October 1, 2026",
    sections: [
      {
        heading: "What cookies we use",
        body: [
          "We use strictly necessary cookies to keep you signed in and to secure the service. We also use a small number of analytics cookies to understand how the product is used.",
        ],
      },
      {
        heading: "Managing cookies",
        body: [
          "You can control cookies through your browser settings. Disabling strictly necessary cookies may prevent the service from working correctly.",
        ],
      },
      {
        heading: "Third parties",
        body: [
          "Some cookies are set by trusted third parties that help us operate, secure and analyze the service. We require these providers to protect your data.",
        ],
      },
    ],
  },
}

export const legalSlugs = Object.keys(legalDocuments)
