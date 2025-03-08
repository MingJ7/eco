import Image from 'next/image'
import NavBarItem from './NavBarItem'

export default function NavBar() {
  return (
    <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left bg-green-200">
        <h1 className='text-4xl font-bold'>
          Eco
        </h1>
        <NavBarItem
          url="/order"
          header='Order'
        />
        <NavBarItem
          url="/login"
          header='Login'
        />
    </div>
  )
}
