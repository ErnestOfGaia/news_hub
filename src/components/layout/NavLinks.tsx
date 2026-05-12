'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavLink = {
  href: string
  label: string
}

type NavLinksProps = {
  links: NavLink[]
  className?: string
  itemClassName?: string
  activeClassName?: string
}

export default function NavLinks({
  links,
  className,
  itemClassName,
  activeClassName,
}: NavLinksProps) {
  const pathname = usePathname()

  return (
    <nav className={className}>
      {links.map((link) => {
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`${itemClassName ?? ''} ${isActive ? (activeClassName ?? '') : ''}`.trim()}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
