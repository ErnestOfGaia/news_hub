import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-stone-200 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-semibold text-stone-900 tracking-tight">
        Ernest of Gaia
      </Link>
      <nav>
        <Link href="/about" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
          About
        </Link>
      </nav>
    </header>
  );
}
