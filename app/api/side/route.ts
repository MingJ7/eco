import { sideList, updateSideMap } from "@/lib/mongodbVarCache";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (sideList.length <= 0) await updateSideMap()
  return NextResponse.json(sideList)
}