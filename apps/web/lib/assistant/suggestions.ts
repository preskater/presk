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
