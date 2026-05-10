import Link from 'next/link'
import NavLinks from './NavLinks'

const NAV_LINKS = [
  { href: '/', label: 'NEWS HUB WORLD' },
  { href: '/signals', label: 'SIGNALS' },
  { href: '/collected', label: 'COLLECTED' },
  { href: '/settings', label: 'SETTINGS' },
]

export default function Header() {
  return (
    <>
      <header className="bg-nhw-bg border-b border-nhw-cyan/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-label-lg text-nhw-cyan uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            COASTAL COMMAND CENTER
          </Link>
          <NavLinks
            links={NAV_LINKS}
            className="hidden md:flex items-center gap-6"
            itemClassName="text-label-sm text-nhw-cyan/60 uppercase tracking-widest hover:text-nhw-cyan transition-colors pb-0.5 border-b-2 border-transparent"
            activeClassName="text-nhw-cyan border-b-2 border-nhw-cyan"
          />
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-nhw-bg border-t border-nhw-cyan/20 flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex-1 flex items-center justify-center py-3 text-label-sm text-nhw-cyan/60 uppercase tracking-widest hover:text-nhw-cyan transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
