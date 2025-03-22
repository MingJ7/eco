import Link from 'next/link'

export default function NavBarItem({url, header}: {url: string, header: string}) {
  return (
        <Link
          href={url}
          className="group rounded-lg px-5 py-1 transition-colors flex items-center"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            {header}
          </h2>
        </Link>
  )
}
