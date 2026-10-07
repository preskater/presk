export interface Suggestion {
  label: string
  prompt: string
}

export const suggestions: Suggestion[] = [
  {
    label: "Catch me up",
    prompt: "Catch me up on my workspace",
  },
  {
    label: "Plan my day",
    prompt: "Help me plan my day",
  },
  {
    label: "Summarize a project",
    prompt: "Summarize the Website Redesign project",
  },
  {
    label: "Draft a message",
    prompt: "Draft a message to the engineering channel",
  },
]

interface CannedReply {
  keywords: string[]
  reply: string
}

export const cannedReplies: CannedReply[] = [
  {
    keywords: ["catch", "up", "workspace", "activity"],
    reply:
      "Here's your workspace recap: 3 projects are active, 2 tasks moved to review today, and you have 5 unread messages in #engineering. Want me to open the busiest project?",
  },
  {
    keywords: ["plan", "day", "schedule", "calendar", "meeting"],
    reply:
      "Your day looks like this: Engineering standup at 9:00, Design critique at 10:00, and Roadmap review at 15:00. There's a free 2-hour block after lunch — good for focused work. Shall I block it?",
  },
  {
    keywords: ["summar", "project", "redesign", "task", "status"],
    reply:
      "Website Redesign is 40% complete. Design tokens are in review, the marketing pages are in progress, and the blog migration is queued. The critical path is the CMS migration — want me to draft a task for it?",
  },
  {
    keywords: ["draft", "message", "channel", "send", "write"],
    reply:
      "Here's a draft for #engineering: “Quick update — the API rotation flow is ready for review and the release candidate is on track for Friday. Please review the PR before EOD.” Want me to post it?",
  },
  {
    keywords: ["file", "document", "share", "permission"],
    reply:
      "I found the document. It's shared with 3 people and currently restricted. I can widen access or copy a link — which would you like?",
  },
  {
    keywords: ["task", "create", "add", "todo"],
    reply:
      "I can add that as a task. Based on your recent activity I'd assign it to In Progress in Website Redesign with a medium priority. Confirm and I'll create it.",
  },
]

export const defaultReply =
  "I'm your Presk assistant. I can summarize projects, plan your day, draft messages and manage tasks. Try asking me to “catch me up” or “plan my day”."

export function replyFor(input: string): string {
  const lower = input.toLowerCase()
  const match = cannedReplies.find((entry) =>
    entry.keywords.some((keyword) => lower.includes(keyword))
  )
  return match?.reply ?? defaultReply
}
