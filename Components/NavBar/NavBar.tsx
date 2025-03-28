"use client"
import { Session } from 'next-auth'
import NavBarItem from './NavBarItem'
import { signIn, signOut, useSession } from 'next-auth/react'

export function LoginBar({session}: {session: Session | null}) {
  if (!session) return <button className='btn-sm green' onClick={()=>signIn()}>Sign in</button>
  return (
    <div className='flex w-full items-center'>
      <div className=''>{session.user?.name}</div>
      <div className='flex-filler'></div>
      <button className='btn-sm green' onClick={()=>signOut()}>Sign Out</button>
    </div>
  )
}

export default function NavBar() {
  const { data: session } = useSession()
  return (
    <div className="Nav-bar">
      <h1 className='text-4xl font-bold float-left'>
        Chia's Eco Rice
      </h1>
      <NavBarItem
        url="/order/dish"
        header='Create Order'
      />
      {session?.user?.role == "Admin" ? <NavBarItem url="/admin" header='Manage Shop' /> : <div />}
      <LoginBar session={session}/>
    </div>
  )
}
