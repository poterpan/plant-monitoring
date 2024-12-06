import { MainNav } from "@/components/layout/main-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* 修改這行 */}
        <div className="flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <MainNav />
        </div>
      </div>
    </header>
  )
}