import Link from 'next/link'

export default function NavBarItem({url, header}: {url: string, header: string}) {
  return (
        <Link
          href={url}
          className="group rounded-lg border border-transparent px-5 py-1 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            {header}
          </h2>
        </Link>
  )
}
