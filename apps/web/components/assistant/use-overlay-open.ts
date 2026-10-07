"use client"

import * as React from "react"

const OVERLAY_SELECTOR = [
  '[data-slot="dialog-content"]',
  '[data-slot="sheet-content"]',
  '[data-slot="drawer-popup"]',
  '[data-slot="alert-dialog-content"]',
].join(",")

export function useOverlayOpen() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    function check() {
      setOpen(document.querySelector(OVERLAY_SELECTOR) !== null)
    }

    check()
    const observer = new MutationObserver(check)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return open
}
