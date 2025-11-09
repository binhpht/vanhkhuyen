'use client'

import { UserMenu } from './auth/UserMenu'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const menuItems = [
    { href: '/', label: 'Trang chủ' },
    { href: '/dictionary', label: 'Từ điển' },
    { href: '/contact', label: 'Liên hệ' },
    { href: '/links', label: 'Liên kết website' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="text-3xl">🐦</div>
            <div>
              <div className="font-bold text-xl leading-tight">Vành Khuyên</div>
              <div className="text-xs text-muted-foreground hidden md:block">Cùng khám phá ngôn ngữ</div>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <UserMenu session={session} />
        </div>

        {/* Mobile Menu */}
        <nav className="md:hidden flex overflow-x-auto gap-4 pb-2 -mx-4 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs font-medium whitespace-nowrap transition-colors hover:text-primary ${
                pathname === item.href ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

