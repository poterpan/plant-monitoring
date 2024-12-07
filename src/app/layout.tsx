import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { SiteHeader } from "@/components/layout/site-header"
import QueryProvider from "@/components/providers/query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "植物生長監測系統",
  description: "即時監測與分析植物生長與環境條件",
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