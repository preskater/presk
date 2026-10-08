export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startRealtimeListener } = await import("@/lib/realtime/pg")
    startRealtimeListener()
  }
}
