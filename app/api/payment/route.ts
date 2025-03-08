import { getOrderByID, updateOrder } from "@/lib/mongodbaccess"
import { createHash } from "crypto"
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

export async function GET(req:NextRequest) {
  const query = req.nextUrl.searchParams
  if (!query.has("orderId")) return NextResponse.json({response: `Internal Server Error`}, {status: 500})
  // const id = typeof(query.orderID) == "string" ? query.orderID : query.orderID[0]
  const id = query.get("orderId")!
  console.log("payment id GET REQ", id)
  const res = await getOrderByID(id)
  if (!res) return NextResponse.json({response: `No such order`})
  const txnReq = get_tranReq(id, res.total_cost)
  return NextResponse.json(
    {
      "txnReq": txnReq,
      "keyId": key,
      "hmac": get_hmac(txnReq)
    }
  )
}

const key = "231e4c11-135a-4457-bc84-3cc6d3565506"
const secert_key ="16c573bf-0721-478a-8635-38e53e3badf1"

function get_date(){
  const d = new Date()
  const dateStr =  "" + d.getFullYear() + d.getMonth + d.getDay() + " " + 
                    d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ":" + d.getMilliseconds()
  return dateStr
}

function get_tranReq(id: string, cost: number){
  let txnReq =  {
    "ss":"1",
    "msg":{
          "txnAmount":cost,
          "merchantTxnRef":id,
          "b2sTxnEndURL":"serverURL/viewOrder/" + id,
          "s2sTxnEndURL":"serverURL/api/payment",
  
          "netsMid":"11137066800", 
          "merchantTxnDtm": get_date(), 
  
          "submissionMode":"B", 
          "paymentType":"SALE", 
          "paymentMode":"QR",
          "clientType":"W",
          "currencyCode":"SGD", 
          "merchantTimeZone":"+8:00", 
          "netsMidIndicator":"U",
    }
  }
  return txnReq
}

function get_hmac(txnReq: any){
  const txnReqStr = JSON.stringify(txnReq)
  const hmac = createHash("sha256").update(txnReqStr + secert_key).digest("base64")
  return hmac
}
