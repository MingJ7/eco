import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { authOptions } from './app/api/auth/[...nextauth]/route'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // console.log(request)
  // const session = await getServerSession(authOptions)
  // console.log("sesion", session)
  // if (session?.user?.role != "Admin") return new NextResponse("Not Authorised", {status: 403})
  // return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/about/:path*', '/admin/:path*'],
}