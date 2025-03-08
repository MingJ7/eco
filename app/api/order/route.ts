// import { getAllSide } from "@/lib/mysqlaccess";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Iorder, createOrder } from "@/lib/mongodbaccess";
import { mainMap, sideMap, updateMainMap, updateSideMap } from "@/lib/mongodbVarCache";


export async function POST(req: Request) {
  console.log("POST REQ")
  if (mainMap.size <= 0 || sideMap.size <= 0) {await updateMainMap(); await updateSideMap()}
  // const session = await getServerSession(authOptions)
  // if (!session) redirect("/api/auth/signin")
  // console.log("getting user")
  // if (!session.user?.email) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  const data = await req.json()
  // console.log(order)
  // Validate all items in order is valid
  for (const dish of data.dishes){
    if (!(
      mainMap.get(dish.main_id) &&
      sideMap.get(dish.side1_id) &&
      (!dish.side2 || sideMap.get(dish.side2_id)) &&
      (!dish.side3 || sideMap.get(dish.side3_id)) &&
      (!dish.side4 || sideMap.get(dish.side4_id)) &&
      (!dish.side5 || sideMap.get(dish.side5_id))
    )) return NextResponse.json({error: "Internal Server Error"}, {status: 500})
  }
  const embededList = data.dishes.map((dish: any) => 
    { return {
      main: mainMap.get(dish.main_id),
      side1: sideMap.get(dish.side1_id),
      side2: sideMap.get(dish.side2_id),
      side3: sideMap.get(dish.side3_id),
      side4: sideMap.get(dish.side4_id),
      side5: sideMap.get(dish.side5_id)
    }})
  const timeNow = new Date()
  let total_cost = 0
  for (const dish of embededList){
    total_cost += dish.main?.cost ?? 0
    total_cost += dish.side1?.cost ?? 0
    total_cost += dish.side2?.cost ?? 0
    total_cost += dish.side3?.cost ?? 0
    total_cost += dish.side4?.cost ?? 0
    total_cost += dish.side5?.cost ?? 0
  }
  const order: Iorder = {
    userEmail: "session.user?.email",
    total_cost: total_cost,
    creation_time: timeNow,
    update_time: timeNow,
    status: 0,
    rejection_reason: "",
    dishes: embededList
  }
  const orderid = await createOrder(order)
  if (orderid) return NextResponse.json({id: orderid.toString()})
  return NextResponse.json({error: "Internal Server Error"}, {status: 500})
}