import Image from 'next/image'
import NavBarItem from './NavBarItem'

export default function NavBar() {
  return (
    <div className="grid text-center grid-cols-1 lg:mb-0 lg:grid-cols-4 lg:text-left bg-green-200">
        <h1 className='text-4xl font-bold'>
          Eco
        </h1>
        <NavBarItem
          url="/order/dish"
          header='Order'
        />
        <div/>
        <NavBarItem
          url="/login"
          header='Login'
        />
    </div>
  )
}
