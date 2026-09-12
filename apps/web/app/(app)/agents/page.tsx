import { AgentList } from "@/components/agents/agent-list"

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <AgentList />
    </div>
  )
}
