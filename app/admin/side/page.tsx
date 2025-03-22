"use client"
import SidetBody from "./tBody"
import { useRouter } from "next/navigation"


export default function Component() {
  const router = useRouter()
  return (
    <>
      <SidetBody />
      <button
      className="btn-sm green"
      onClick={()=> router.push("side/curd")}>
        Add Side
      </button>
    </>
  )
}
