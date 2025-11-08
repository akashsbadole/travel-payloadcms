'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'

import type { Header } from 'src/payload-types'
import { MobileMenu } from './MobileMenu'

import { LogoIcon } from '@/components/icons/logo'
import { cn } from '@/utilities/cn'
import { Bell, MessageSquare, Plus, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

type Props = {
  header: Header
}

export function HeaderClient({ header }: Props) {
  const menu = header.navItems || []
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    fetch('/api/users/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="relative z-50 border-b border-border bg-background/95 backdrop-blur-sm shadow-sm top-0">
      <nav className="flex items-center justify-between container py-4">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} />
          </Suspense>
        </div>

        <div className="flex w-full items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-between w-full ">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2">
              <LogoIcon className="w-8 h-8 text-blue-600" />
              <span className="hidden md:block text-xl font-bold text-blue-900">TravelHub</span>
            </Link>

            {/* Center: Navigation Links (hidden on mobile) */}
            <nav className="hidden md:flex items-center gap-6 text-sm flex-1 justify-center">
              <Link
                href="/"
                className={cn('font-medium hover:text-blue-600 transition-colors', {
                  'text-blue-600': pathname === '/',
                })}
              >
                Home
              </Link>
              <Link
                href="/packages"
                className={cn('font-medium hover:text-blue-600 transition-colors', {
                  'text-blue-600': pathname.includes('/packages'),
                })}
              >
                Packages
              </Link>
              <Link
                href="/holiday-ideas"
                className={cn('font-medium hover:text-blue-600 transition-colors', {
                  'text-blue-600': pathname.includes('/holiday-ideas'),
                })}
              >
                Holiday Ideas
              </Link>
              <Link
                href="/ai-assistant"
                className={cn(
                  'font-medium hover:text-blue-600 transition-colors flex items-center gap-1',
                  {
                    'text-blue-600': pathname.includes('/ai-assistant'),
                  },
                )}
              >
                <MessageSquare className="h-4 w-4" />
                AI Assistant
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className={cn('font-medium hover:text-blue-600 transition-colors', {
                    'text-blue-600': pathname.includes('/dashboard'),
                  })}
                >
                  Dashboard
                </Link>
              )}
            </nav>

            {/* Right: Sign In & Register Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-white hover:bg-white/10 font-medium">
                Sign In
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium px-4 py-2 rounded-md border-0">
                Register
              </Button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <>
                    {/* Submit Requirement Button */}
                    <Link href="/requirements/new" className="hidden md:block">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-1 h-4 w-4" />
                        New Requirement
                      </Button>
                    </Link>

                    {/* Notifications */}
                    <Link href="/notifications">
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {/* Notification badge */}
                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                      </Button>
                    </Link>

                    {/* User Menu */}
                    <Link href="/account">
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/create-account">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}
