import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"

export async function checkAdmin() {
    const session = await getServerSession(authOptions)
    if (!session) notFound()
    if (session.user?.role !== "Admin") notFound()
    return true
  }
  