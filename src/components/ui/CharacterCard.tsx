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
      className="relative block border border-nhw-cyan/30 p-0 hover:border-nhw-cyan/60 transition-colors overflow-hidden flex flex-col h-full min-h-[350px] sm:min-h-[450px] group bg-nhw-surface"
    >
      {portraitSrc && (
        <>
          <img
            src={portraitSrc}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-100 transition-opacity duration-500 z-0"
          />
          {/* Gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-nhw-bg/90 via-nhw-bg/30 to-transparent z-0 pointer-events-none" />
        </>
      )}

      <div className="relative z-10 p-5 flex flex-col flex-1 justify-end mt-auto h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-nhw-cyan/20 gap-2">
          <span className="text-label-sm text-nhw-cyan/80 uppercase tracking-widest drop-shadow-md">
            ID: {name}
          </span>
          <span className="text-label-sm text-nhw-cyan/80 uppercase tracking-widest sm:text-right drop-shadow-md">
            STATUS: {statusLine}
          </span>
        </div>

        <div>
          <p className="text-label-lg text-nhw-cyan uppercase mb-1 drop-shadow-md">{name}</p>
          <p className="text-label-sm text-nhw-cyan/60 uppercase tracking-widest mb-3 drop-shadow-md">{role}</p>
          <p className="text-body-md text-white/90 drop-shadow-md">{description}</p>
        </div>
      </div>
    </Link>
  )
}
