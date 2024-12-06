import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { SiteHeader } from "@/components/layout/site-header"
import QueryProvider from "@/components/providers/query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Plant Growth Monitoring",
  description: "Monitor plant growth and environmental conditions",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}