'use client'

import { Session } from 'next-auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

type UserMenuProps = {
  session: Session | null
}

export function UserMenu({ session }: UserMenuProps) {
  if (!session?.user) {
    return (
      <Button asChild>
        <Link href="/auth/signin">Đăng nhập</Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">
        Xin chào, <span className="font-medium text-foreground">{session.user.name}</span>
      </span>
      <Button variant="outline" onClick={() => signOut()}>
        Đăng xuất
      </Button>
    </div>
  )
}

