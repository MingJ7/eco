"use client"
import { useRouter } from "next/navigation"
import MainstBody from "./tBody"

export default function Component() {
  // await checkAdmin()
  const router = useRouter()
  return (
    <>
      <MainstBody/>
      <button
      className="btn-sm green"
      onClick={()=> router.push("main/curd")}>
        Add Main
      </button>
    </>
  )
}
