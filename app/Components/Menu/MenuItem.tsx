import Image from 'next/image'

export default function MenuItem({imageSrc, Name, QtyLeft}: {imageSrc: string, Name: string, QtyLeft: number}) {
  return (
    <button
      onClick={ ()=>{} }
      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
    >
      <Image
        src="/next.svg"
        alt={Name}
        width={500}
        height={500}
      />
      <h1
        className=' text-7xl text-right to-blue-500'
      >{Name}</h1>
      <p>Qty Left: {QtyLeft}</p>

    </button>
  )
}
