import { members as workspaceMembers } from "@/lib/projects/mock-data"

import type {
  Conversation,
  Message,
  MessagingData,
  Presence,
  Team,
} from "./types"

export const members = workspaceMembers

export const teams: Team[] = [
  {
    id: "t_product",
    name: "Product",
    description: "Design, engineering and roadmap",
    channelIds: ["c_general", "c_engineering", "c_design"],
  },
  {
    id: "t_operations",
    name: "Operations",
    description: "Go-to-market, support and billing",
    channelIds: ["c_ops_general", "c_marketing", "c_support"],
  },
]

export const conversations: Conversation[] = [
  {
    id: "c_general",
    kind: "channel",
    name: "General",
    teamId: "t_product",
    memberIds: ["u_aria", "u_marcus", "u_priya", "u_jon", "u_lena"],
    topic: "Company-wide announcements and general chatter",
    unreadCount: 0,
    lastMessageAt: "2026-10-06T09:42:00.000Z",
    pinned: true,
  },
  {
    id: "c_engineering",
    kind: "channel",
    name: "Engineering",
    teamId: "t_product",
    memberIds: ["u_aria", "u_marcus", "u_priya", "u_jon", "u_lena"],
    topic: "Build, ship, and keep the lights on",
    unreadCount: 3,
    lastMessageAt: "2026-10-06T10:05:00.000Z",
    pinned: true,
  },
  {
    id: "c_design",
    kind: "channel",
    name: "Design",
    teamId: "t_product",
    memberIds: ["u_aria", "u_marcus", "u_priya"],
    topic: "Design system, research and critique",
    unreadCount: 0,
    lastMessageAt: "2026-10-05T15:20:00.000Z",
  },
  {
    id: "c_ops_general",
    kind: "channel",
    name: "General",
    teamId: "t_operations",
    memberIds: ["u_aria", "u_marcus", "u_lena", "u_tom"],
    topic: "Operations announcements",
    unreadCount: 0,
    lastMessageAt: "2026-10-04T13:10:00.000Z",
  },
  {
    id: "c_marketing",
    kind: "channel",
    name: "Marketing",
    teamId: "t_operations",
    memberIds: ["u_aria", "u_priya", "u_tom"],
    topic: "Campaigns, launches and content",
    unreadCount: 1,
    lastMessageAt: "2026-10-05T11:30:00.000Z",
  },
  {
    id: "c_support",
    kind: "channel",
    name: "Support",
    teamId: "t_operations",
    memberIds: ["u_aria", "u_marcus", "u_lena"],
    topic: "Customer escalations and help desk",
    unreadCount: 0,
    lastMessageAt: "2026-10-03T16:45:00.000Z",
  },
  {
    id: "dm_marcus",
    kind: "dm",
    name: "Marcus Reid",
    memberIds: ["u_aria", "u_marcus"],
    unreadCount: 2,
    lastMessageAt: "2026-10-06T08:55:00.000Z",
  },
  {
    id: "dm_priya",
    kind: "dm",
    name: "Priya Nair",
    memberIds: ["u_aria", "u_priya"],
    unreadCount: 0,
    lastMessageAt: "2026-10-05T17:05:00.000Z",
  },
  {
    id: "dm_jon",
    kind: "dm",
    name: "Jon Alvarez",
    memberIds: ["u_aria", "u_jon"],
    unreadCount: 0,
    lastMessageAt: "2026-10-05T09:15:00.000Z",
  },
  {
    id: "dm_lena",
    kind: "dm",
    name: "Lena Fischer",
    memberIds: ["u_aria", "u_lena"],
    unreadCount: 0,
    lastMessageAt: "2026-10-04T12:40:00.000Z",
  },
]

let counter = 0
function msg(
  conversationId: string,
  authorId: string,
  body: string,
  createdAt: string,
  extra: Partial<Message> = {}
): Message {
  counter += 1
  return {
    id: `m_${counter}`,
    conversationId,
    authorId,
    body,
    createdAt,
    reactions: [],
    attachments: [],
    ...extra,
  }
}

export const messages: Message[] = [
  // Product / General
  msg(
    "c_general",
    "u_marcus",
    "Morning everyone :wave: Reminder that the Q4 planning doc is due Friday.",
    "2026-10-06T08:30:00.000Z",
    { reactions: [{ emoji: "👍", memberIds: ["u_aria", "u_priya", "u_jon"] }] }
  ),
  msg(
    "c_general",
    "u_priya",
    "Added the design milestones to the doc. @Aria can you review the timeline?",
    "2026-10-06T08:52:00.000Z"
  ),
  msg(
    "c_general",
    "u_aria",
    "On it — will take a look after standup.",
    "2026-10-06T09:01:00.000Z",
    { reactions: [{ emoji: "✅", memberIds: ["u_priya"] }] }
  ),
  msg(
    "c_general",
    "u_lena",
    "Sharing the mobile roadmap summary for visibility.",
    "2026-10-06T09:30:00.000Z",
    {
      attachments: [
        {
          id: "a_1",
          name: "mobile-roadmap-q4.pdf",
          kind: "file",
          meta: "PDF · 1.2 MB",
        },
      ],
    }
  ),
  msg(
    "c_general",
    "u_marcus",
    "Thanks Lena :raised_hands:",
    "2026-10-06T09:42:00.000Z"
  ),

  // Product / Engineering
  msg(
    "c_engineering",
    "u_jon",
    "The offline sync prototype is on the branch `feat/offline-sync` if anyone wants to try it.",
    "2026-10-06T09:10:00.000Z",
    { reactions: [{ emoji: "🎉", memberIds: ["u_aria", "u_lena"] }] }
  ),
  msg(
    "c_engineering",
    "u_lena",
    "Nice. I'll run it against the CRDT test suite this afternoon.",
    "2026-10-06T09:22:00.000Z"
  ),
  msg(
    "c_engineering",
    "u_marcus",
    "Heads up: the API key rotation endpoint changed. Docs updated.",
    "2026-10-06T09:40:00.000Z",
    {
      attachments: [
        {
          id: "a_2",
          name: "openapi.yaml",
          kind: "file",
          meta: "YAML · 84 KB",
        },
      ],
    }
  ),
  msg(
    "c_engineering",
    "u_aria",
    "Great — @Jon please review the PR before EOD so we can ship the release candidate.",
    "2026-10-06T09:58:00.000Z",
    { reactions: [{ emoji: "👀", memberIds: ["u_jon"] }] }
  ),
  msg(
    "c_engineering",
    "u_priya",
    "Found a regression on the cold-start fix. Investigating now :bug:",
    "2026-10-06T10:05:00.000Z",
    { reactions: [{ emoji: "😬", memberIds: ["u_aria", "u_jon"] }] }
  ),

  // Design
  msg(
    "c_design",
    "u_priya",
    "New design tokens are live. Type scale and spacing are in the Figma library.",
    "2026-10-05T14:05:00.000Z",
    {
      attachments: [
        {
          id: "a_3",
          name: "design-tokens.png",
          kind: "image",
          meta: "PNG · 640 KB",
        },
      ],
    }
  ),
  msg(
    "c_design",
    "u_aria",
    "The contrast on the secondary button needs another pass, but otherwise looks great.",
    "2026-10-05T14:40:00.000Z"
  ),
  msg(
    "c_design",
    "u_priya",
    "Agreed — will bump it to AA today.",
    "2026-10-05T15:20:00.000Z",
    { reactions: [{ emoji: "👍", memberIds: ["u_aria"] }] }
  ),

  // Operations / General
  msg(
    "c_ops_general",
    "u_lena",
    "Billing migration is fully cut over. Legacy provider is now read-only.",
    "2026-10-04T12:30:00.000Z",
    { reactions: [{ emoji: "🎉", memberIds: ["u_aria", "u_marcus", "u_tom"] }] }
  ),
  msg(
    "c_ops_general",
    "u_marcus",
    "Invoices for September went out this morning.",
    "2026-10-04T13:10:00.000Z"
  ),

  // Marketing
  msg(
    "c_marketing",
    "u_tom",
    "Launch week draft is ready for review. @Aria @Priya can you both take a look?",
    "2026-10-05T11:05:00.000Z",
    {
      attachments: [
        {
          id: "a_4",
          name: "launch-week-plan.docx",
          kind: "file",
          meta: "DOCX · 220 KB",
        },
      ],
    }
  ),
  msg(
    "c_marketing",
    "u_priya",
    "Reading through it now — love the hero section.",
    "2026-10-05T11:30:00.000Z"
  ),

  // Support
  msg(
    "c_support",
    "u_lena",
    "Escalation from Acme about webhook timeouts. Digging in.",
    "2026-10-03T16:20:00.000Z"
  ),
  msg(
    "c_support",
    "u_marcus",
    "Looks like it correlates with the rate-limit deploy. Rolling back the config.",
    "2026-10-03T16:45:00.000Z",
    { reactions: [{ emoji: "🙏", memberIds: ["u_lena"] }] }
  ),

  // DM Marcus (with a thread)
  msg(
    "dm_marcus",
    "u_marcus",
    "Do you have five minutes to review the pricing proposal?",
    "2026-10-06T08:45:00.000Z"
  ),
  msg(
    "dm_marcus",
    "u_aria",
    "Sure — send it over and I'll leave comments.",
    "2026-10-06T08:50:00.000Z"
  ),
  msg(
    "dm_marcus",
    "u_marcus",
    "Just shared the draft. The usage tiers are on page 3.",
    "2026-10-06T08:55:00.000Z",
    {
      attachments: [
        {
          id: "a_5",
          name: "pricing-proposal-v2.pdf",
          kind: "file",
          meta: "PDF · 560 KB",
        },
      ],
    }
  ),
  // Thread replies on the pricing message (m_22 -> parent set below via parentId)
  msg(
    "dm_marcus",
    "u_aria",
    "Left a comment on the enterprise tier — think we can simplify to three levels.",
    "2026-10-06T09:05:00.000Z",
    { parentId: "m_22" }
  ),
  msg(
    "dm_marcus",
    "u_marcus",
    "Good call. I'll rework it and resend.",
    "2026-10-06T09:12:00.000Z",
    { parentId: "m_22", reactions: [{ emoji: "👍", memberIds: ["u_aria"] }] }
  ),

  // DM Priya
  msg(
    "dm_priya",
    "u_priya",
    "Pushed the button fix. Want to pair on the calendar view tomorrow?",
    "2026-10-05T16:50:00.000Z"
  ),
  msg(
    "dm_priya",
    "u_aria",
    "Yes! 10am works.",
    "2026-10-05T17:05:00.000Z",
    { reactions: [{ emoji: "✅", memberIds: ["u_priya"] }] }
  ),

  // DM Jon
  msg(
    "dm_jon",
    "u_jon",
    "Standup notes are in the channel. Nothing blocking me.",
    "2026-10-05T09:15:00.000Z"
  ),

  // DM Lena
  msg(
    "dm_lena",
    "u_lena",
    "Thanks for the review on MOB-1 :pray:",
    "2026-10-04T12:40:00.000Z"
  ),
]

// Attach the thread replies to their parent and add a meeting card in General.
messages.push(
  msg(
    "c_general",
    "u_marcus",
    "",
    "2026-10-04T10:00:00.000Z",
    {
      meeting: {
        title: "Q4 Roadmap Review",
        startsAt: "2026-10-08T15:00:00.000Z",
        durationMinutes: 45,
      },
    }
  )
)

const parent = messages.find((message) => message.id === "m_22")
if (parent) {
  parent.reactions = [{ emoji: "👍", memberIds: ["u_marcus"] }]
}

export const presence: Record<string, Presence> = {
  u_aria: "online",
  u_marcus: "busy",
  u_priya: "online",
  u_jon: "away",
  u_lena: "online",
  u_tom: "offline",
}

export const typing: Record<string, string[]> = {
  c_engineering: ["u_jon"],
}

export const messagingData: MessagingData = {
  teams,
  conversations,
  messages,
  presence,
  typing,
}
