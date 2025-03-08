import { mainList, updateMainMap } from "@/lib/mongodbVarCache";
import { getAllMains } from "@/lib/mongodbaccess";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (mainList.length <= 0) await updateMainMap()
  console.log(mainList)
  return NextResponse.json(mainList)
}