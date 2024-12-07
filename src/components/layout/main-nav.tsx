"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className={cn(
        "mr-6 flex items-center space-x-2",
        "text-sm font-medium transition-colors hover:text-primary"
      )}>
        <span>植物生長監測系統</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60"
          )}
        >
          總覽
        </Link>
        <Link
          href="/analysis"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/analysis" ? "text-foreground" : "text-foreground/60"
          )}
        >
          歷史分析
        </Link>
      </nav>
    </div>
  )
}