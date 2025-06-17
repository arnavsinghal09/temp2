import type React from "react"

export default function WatchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="fullscreen-video">{children}</div>
}
