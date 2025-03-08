import { createSide, deleteSide, updateSide } from "@/lib/mongodbaccess";
import { S3 } from "aws-sdk";
import { NextResponse } from "next/server";
const s3Bucket = new S3({
  accessKeyId: "AKIASL53ZPCIDRIZ634X",
  secretAccessKey: "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",
  region: "ap-southeast-1",
})

export async function POST(req: Request) {
  if (!req.body) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  const {id, expected_remainder} = await req.json()
  if (!id || expected_remainder === undefined) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  const ok = await updateSide(id, null, null, expected_remainder)
  console.log(ok)
  if (!ok) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  return NextResponse.json({response: `Updated ${id}`})
}

export async function PUT(req: Request){
  if (!req.body) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  let {enName, cnName, imgB64, type, cost} = await req.json()
  if (!enName || !cnName || !type || cost === undefined) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  cost = Number(cost)
  const [mimeStr, imgData] = imgB64.split(",", 2)
  const [_, imgType, subType] = mimeStr.match(/^data:(.+)\/(.+);base64$/);
  const s3UploadPromise = s3Bucket.upload(
    {Bucket: "chiaecoriceimages", Key: enName+"."+subType, Body: Buffer.from(imgData, "base64"), ContentEncoding: imgType+"/"+subType}
  ).promise()
  var imgLocation = ""
  try {
    imgLocation = (await s3UploadPromise).Location
  } catch (error) {
    console.log(error)
    return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  }
  const ok = await createSide(enName, cnName, imgLocation, type, cost, 40)
  if (!ok) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  return NextResponse.json({response: `Added ${enName}`})
}

export async function DELETE(req: Request){
  // console.log(req)
  if (!req.body) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  const {id} = await req.json()
  if (!id) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  const ok = await deleteSide(id)
  if (!ok) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  return NextResponse.json({response: `deleted ${id}`})
}