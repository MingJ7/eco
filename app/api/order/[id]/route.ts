import { getOrderByID, updateOrder } from "@/lib/mongodbaccess";
import { NextResponse } from "next/server";


// export async function POST(req: Request) {
//   console.log("order POST REQ")
//   const {id, status} = await req.json()
//   console.log(id, status)
//   //Check for valid payment here.
// //   updateOrder(id, 0)
//   return NextResponse.json({response: `Internal Server Error`}, {status: 500})
// }

export async function GET(req: Request, { params }: { params: { id: string } }) {
    params = await params
    console.log("order id GET REQ", params.id)
    const res = await getOrderByID(params.id)
    if (!res) return NextResponse.json({response: `Internal Server Error`}, {status: 500})
    return NextResponse.json(res)
  }
  

