"use client"
import { useRouter } from "next/navigation"


export default function Component() {
  const router = useRouter()
  return (
    <div>
      <button
      className="btn-sm green"
      onClick={()=> router.push("/admin/main")}>
        Manage Main
      </button>
      <button
      className="btn-sm green"
      onClick={()=> router.push("/admin/side")}>
        Manage Side
      </button>
      <button
      className="btn-sm green"
      onClick={()=> router.push("/admin/order")}>
        Manage Order
      </button>
      <button
      className="btn-sm green"
      onClick={()=> router.push("/admin/camera")}>
        Camera
      </button>
    </div>
  )
}
