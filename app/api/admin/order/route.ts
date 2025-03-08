import { getAllIncompleteOrder, rejectOrderByOOS, rejectOrderByStoreClose, updateOrder } from "@/lib/mongodbaccess";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  console.log("order POST REQ")
  const {id, status, mainReason, subReason} = await req.json()
  console.log(id, status, mainReason, subReason)
  if (status === 1){
    const res = await updateOrder(id, status)
    if (!res) return NextResponse.json({response: `Internal Server Error`}, {status: 500})
    return NextResponse.json({response: `updated ${id}`})
  }
  if (mainReason === "closed"){
    const res = await rejectOrderByStoreClose()
    if (!res) return NextResponse.json({response: `Internal Server Error`}, {status: 500})
    return NextResponse.json({response: `rejected ${res}`})
  } else if (mainReason === "Out of Stock"){
    console.log("i am doing OOS")
    var total = 0
    for (const itemID of subReason){
      const res = await rejectOrderByOOS(itemID)
      total += res ?? 0
    }
    if (!total) return NextResponse.json({response: `Internal Server Error`}, {status: 500})
    return NextResponse.json({response: `rejected ${total}`})
  }
  return NextResponse.json({response: `Internal Server Error`}, {status: 500})
}

export async function GET(req: Request) {
  console.log("order GET REQ")
  const res = await getAllIncompleteOrder()
  if (!res) return NextResponse.json({response: `Internal Server Error`}, {status: 500})
  return NextResponse.json(res)
}

