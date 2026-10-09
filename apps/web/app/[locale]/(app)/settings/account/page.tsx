import { AccountSettings } from "@/components/account/account-settings"

export default function AccountPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <AccountSettings />
    </div>
  )
}
