"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import AuthContext from "../../Components/Auth/AuthContext"
function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        Signed in as {session.user?.role} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export default function cope(){
  return <AuthContext>
    <Component/>
  </AuthContext>
}