import type React from "react"
import { Inter } from "next/font/google"
import Navigation from "./navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`flex h-screen bg-gray-100 ${inter.className}`}>
      <Navigation />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  )
}

