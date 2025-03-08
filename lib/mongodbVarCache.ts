import { WithId } from "mongodb"
import { Imains, Iside, getAllMains, getAllSide } from "./mongodbaccess"

export var mainMap: Map<string, WithId<Imains>> = new Map()
export var sideMap: Map<string, WithId<Iside>> = new Map()
export var mainList: Array<WithId<Imains>> = []
export var sideList: Array<WithId<Iside>> = []

export async function updateMainMap() {
    console.log("main funtion for update main")
    mainList = await getAllMains()
    console.log("updating mainmap start", mainList)
    if (!mainList) return
    const tempMap = new Map<string, WithId<Imains>>()
    for (const main of mainList) {
        tempMap.set(main._id.toString(), main)
    }
    mainMap = tempMap
    console.log("updating mainList completed")
}

export async function updateSideMap() {
    console.log("side funtion for update main")
    sideList = await getAllSide()
    if (!sideList) return
    const tempMap = new Map<string, WithId<Iside>>()
    for (const side of sideList) {
        tempMap.set(side._id.toString(), side)
    }
    sideMap = tempMap
    console.log("update side complete")
}