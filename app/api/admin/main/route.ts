import { createMains, deleteMains, updateMain } from "@/lib/mongodbaccess";
import { S3 } from "aws-sdk";
import { NextResponse } from "next/server";
const s3Bucket = new S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-southeast-1",
})

export async function POST(req: Request) {
  if (!req.body) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  const {id, status} = await req.json()
  if (!id || status === undefined) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  const ok = await updateMain(id, null, status)
  console.log(ok)
  if (!ok) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  return NextResponse.json({response: `Updated ${id}`})
}

export async function PUT(req: Request){
  if (!req.body) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  let {enName, cnName, cost, imgB64} = await req.json()
  console.log(enName, cnName, cost, imgB64);
  if (!enName || !cnName || !imgB64 || cost === undefined) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  cost = Number(cost)
  const [mimeStr, imgData] = imgB64.split(",", 2)
  const [_, type, subType] = mimeStr.match(/^data:(.+)\/(.+);base64$/);
  const s3UploadPromise = s3Bucket.upload(
    {Bucket: "chiaecoriceimages", Key: enName+"."+subType, Body: Buffer.from(imgData, "base64"), ContentEncoding: type+"/"+subType}
  ).promise()
  var imgLocation = ""
  try {
    imgLocation = (await s3UploadPromise).Location
  } catch (error) {
    console.log(error)
    return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  }
  const ok = await createMains(enName, cnName, imgLocation, cost, 1)
  if (!ok) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  return NextResponse.json({response: `Added ${enName}`})
}

export async function DELETE(req: Request){
  // console.log(req)
  if (!req.body) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  const {id} = await req.json()
  if (!id) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  const ok = await deleteMains(id)
  if (!ok) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  return NextResponse.json({response: `deleted ${id}`})
}