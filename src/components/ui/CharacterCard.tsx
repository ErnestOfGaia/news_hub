import Link from 'next/link'

type CharacterCardProps = {
  name: string
  role: string
  statusLine: string
  description: string
  href: string
  portraitSrc?: string
}

export default function CharacterCard({
  name,
  role,
  statusLine,
  description,
  href,
  portraitSrc,
}: CharacterCardProps) {
  return (
    <Link
      href={href}
      className="block bg-nhw-surface border border-nhw-cyan/30 p-4 hover:border-nhw-cyan/60 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-label-sm text-nhw-cyan/60 uppercase tracking-widest">
          IDENTITY: {name}
        </span>
        <span className="text-label-sm text-nhw-cyan/60 uppercase tracking-widest text-right">
          CURRENT STATUS: {statusLine}
        </span>
      </div>

      {portraitSrc ? (
        <img
          src={portraitSrc}
          alt={name}
          className="w-full aspect-square object-cover mb-3"
        />
      ) : (
        <div className="w-full aspect-square bg-nhw-surface/50 mb-3" />
      )}

      <div>
        <p className="text-label-lg text-nhw-cyan uppercase mb-1">{name}</p>
        <p className="text-label-sm text-nhw-cyan/40 uppercase tracking-widest mb-2">{role}</p>
        <p className="text-body-md text-white/70">{description}</p>
      </div>
    </Link>
  )
}
