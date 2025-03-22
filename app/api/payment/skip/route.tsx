import { updateOrder } from "@/lib/mongodbaccess"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    console.log("payment POST REQ")
    const {msg} = await req.json()
    console.log(msg)
    
    if (msg.netsTxnStatus != 0) return NextResponse.json({})
    const ok = await updateOrder(msg.merchantTxnRef, 0)
    if (ok) return NextResponse.json({id: msg.merchantTxnRef})
    console.log(ok)
    return NextResponse.json({response: `Internal Server Error`}, {status: 500})
  }