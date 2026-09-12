import { SessionList } from "@/components/sessions/session-list"

export default function SessionsPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SessionList />
    </div>
  )
}
