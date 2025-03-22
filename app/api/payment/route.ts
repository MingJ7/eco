import { getOrderByID, getOrderBynetsTxnRef, updateOrdeByNetsTxnRef } from "@/lib/mongodbaccess"
import { createHash } from "crypto"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const headerList = await headers()
  console.log("payment POST REQ")
  const formData = await req.formData()
  // var msg = JSON.parse(decodeURI(formData.get("message")!.toString()!));
  let msgbody = decodeURIComponent(formData.get("message")!.toString()!)
  console.log(msgbody)
  msgbody = msgbody.replace(/(?<!")\+/g, ' ')
  const fulljson = JSON.parse(msgbody);
  const msg = fulljson.msg
  console.log(fulljson)
  console.log(msg)
  // const txnRespHmac = headerList.get("hmac")
  const txnRespHmac = formData.get("hmac")
  if (get_hmac(fulljson) != txnRespHmac){
    console.log("invalid hmac", txnRespHmac, get_hmac(fulljson))
    return NextResponse.json({response: "Invalid hmac"}, {status: 400})
  }
  
  if (msg.netsTxnStatus != 0) return NextResponse.json({})
  const ok = await updateOrdeByNetsTxnRef(msg.merchantTxnRef, 0)
  if (ok) {
    const order = await getOrderBynetsTxnRef(msg.merchantTxnRef)
    if (order){
      const url = req.nextUrl.clone()
      url.pathname = "/viewOrder/" + order._id
      return NextResponse.redirect(url)
      // return NextResponse.redirect("/viewOrder/" + order._id)
    }
  }
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
  const txnReq = get_tranReq(id, res.netsTxnRef, res.total_cost)
  return NextResponse.json(
    {
      "txnReq": JSON.stringify(txnReq),
      "keyId": key,
      "hmac": get_hmac(txnReq)
    }
  )
}

const key = "154eb31c-0f72-45bb-9249-84a1036fd1ca"
const secert_key ="38a4b473-0295-439d-92e1-ad26a8c60279"

function get_date(){
  const d = new Date()
  const dateStr =  "" + d.getFullYear() + (d.getMonth() + 1).toString().padStart(2, "0") + d.getDate().toString().padStart(2, "0") + " " + 
                    d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0") + ":" + d.getSeconds().toString().padStart(2, "0") + "." + d.getMilliseconds().toString().padStart(3, "0")
  return dateStr
}

function get_tranReq(id:string, netsTxnRef: string, cost: number){
  cost *= 100 //Cost is in cents
  let txnReq =  {
    "ss":"1",
    "msg":{
          "txnAmount":cost.toString(),
          "merchantTxnRef":netsTxnRef,
          // "b2sTxnEndURL":"https://httpbin.org/post",
          // "b2sTxnEndURL":"https://localhost:3000/viewOrder/" + id,
          "b2sTxnEndURL":"https://localhost:3000/api/payment",
          // "s2sTxnEndURL":"https://httpbin.org/post",
          // "s2sTxnEndURL":"https://localhost:3000/api/payment",
  
          "netsMid":"UMID_877772003", 
          "merchantTxnDtm": get_date(), 
  
          // "supMsg":"",
          // "ipAddress":"127.0.0.1",
          // "tid":"",
          // "langague":"en",
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
  console.log("getting hmac for :\n", txnReqStr)
  const hmac = createHash("sha256").update(txnReqStr + secert_key).digest("base64")
  return hmac
}
