import { MongoClient, ObjectId, WithId } from "mongodb";
import { updateMainMap, updateSideMap } from "./mongodbVarCache";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

export interface Imains {
  name: string,
  cnName: string,
  image: string,
  cost: number,
  status: number
}

export interface Iside {
  name: string,
  cnName: string,
  image: string,
  type: string,
  cost: number,
  expected_remainder: number
}

export interface Idish {
  main: WithId<Imains>,
  side1: WithId<Iside>,
  side2: WithId<Iside> | null,
  side3: WithId<Iside> | null,
  side4: WithId<Iside> | null,
  side5: WithId<Iside> | null,
}

export interface Iorder {
  netsTxnRef: string,
  userEmail: string,
  total_cost: number,
  creation_time: Date,
  update_time: Date,
  status: number,
  rejection_reason: string,
  dishes: Array<Idish>
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const mainsCol = client.db("EconomicRice").collection<Imains>("Mains")
const sidesCol = client.db("EconomicRice").collection<Iside>("Sides")
const ordersCol = client.db("EconomicRice").collection<Iorder>("Orders")

export async function getAllMains() {
  return await mainsCol.find().toArray()
}

export async function getMain(id: string) {
  return await mainsCol.findOne({ _id: new ObjectId(id) })
}

export async function createMains(name: string, cnName: string, image: string, cost: number, status: number) {
  const result = await mainsCol.insertOne({ name: name, cnName: cnName, image: image, cost: cost, status: status })
  if (result.acknowledged) {
    updateMainMap()
    return result.insertedId
  }
  return null
}

export async function deleteMains(id: string) {
  const result = await mainsCol.deleteOne({ _id: new ObjectId(id) })
  if (result.deletedCount){
    updateMainMap()
    return result;
  } 
  return null
}

export async function updateMain(id: string, cost: number | null, status: number | null) {
  const toUpdate: any = {}
  if (cost !== null) toUpdate.cost = cost
  if (status !== null) toUpdate.status = status
  const result = await mainsCol.updateOne({ _id: new ObjectId(id) },
    { $set: toUpdate })
  if (result.acknowledged) {
    updateMainMap()
    return result.modifiedCount
  }
  return null
}

export async function getAllSide() {
  return await sidesCol.find().toArray();
}

export async function getSide(id: string) {
  return await sidesCol.findOne({ _id: new ObjectId(id) })
}

export async function createSide(name: string, cnName: string, image: string, type: string, cost: number, expected_remainder: number) {
  const result = await sidesCol.insertOne({ name: name, cnName: cnName, image: image, cost: cost, type: type, expected_remainder: expected_remainder })
  if (result.acknowledged) {
    updateSideMap()
    return result.insertedId
  }
  return null
}

export async function deleteSide(id: string) {
  const result = await sidesCol.deleteOne({ _id: new ObjectId(id) })
  if (result.deletedCount){
    updateSideMap()
    return result;
  } 
  return null
}

export async function updateSide(id: string, cost: number | null, type: string | null, expected_remainder: number | null) {
  const toUpdate: any = {}
  if (cost !== null) toUpdate.cost = cost
  if (type !== null) toUpdate.type = type
  if (expected_remainder !== null) toUpdate.expected_remainder = expected_remainder
  const result = await sidesCol.updateOne({ _id: new ObjectId(id) },
    { $set: toUpdate })
  if (result.acknowledged) {
    updateSideMap()
    return result.modifiedCount
  }
  return null
}

export async function createOrder(order: Iorder) {
  order.status = -1
  const result = await ordersCol.insertOne(order)
  if (result.acknowledged){
    order.netsTxnRef = result.insertedId.toHexString().slice(4)
    const result2 = await ordersCol.updateOne({ _id: new ObjectId(result.insertedId) },
      { $set: { netsTxnRef: order.netsTxnRef } })
    if (result2.acknowledged && result2.modifiedCount)
    return result.insertedId
  } 
  return null
}

export async function updateOrder(id: string, status: number) {
  const result = await ordersCol.updateOne({ _id: new ObjectId(id) },
    { $set: { status: status } })
  if (result.acknowledged) return result.modifiedCount
  return null
}

export async function updateOrdeByNetsTxnRef(netsTxnRef: string, status: number) {
  const result = await ordersCol.updateOne({ netsTxnRef: netsTxnRef },
    { $set: { status: status } })
  if (result.acknowledged) return result.modifiedCount
  return null
}

export async function rejectOrderByStoreClose() {
  const result = await ordersCol.updateMany({ status: 0 },
    {
      $set: {
        status: 2,
        rejection_reason: "Store Closed"
      }
    })
  if (result.acknowledged) return result.modifiedCount
  return null
}

export async function rejectOrderByOOS(id: string) {
  const reason = "One or more choices was Out of Stock"
  const oid = new ObjectId(id)
  const result = await ordersCol.updateMany(
    {
      'status': 0,
      '$or': [
        {
          'dishes.main._id': oid
        }, {
          'dishes.side1._id': oid
        }, {
          'dishes.side2._id': oid
        }, {
          'dishes.side3._id': oid
        }, {
          'dishes.side4._id': oid
        }, {
          'dishes.side5._id': oid
        }
      ]
    },
    {
      $set: {
        status: 2,
        rejection_reason: reason
      }
    })
  console.log(result.matchedCount)
  if (result.acknowledged) return result.modifiedCount
  return null
}

export async function getAllUserOrder(userEmail: string) {
  return await ordersCol.find({ userEmail: userEmail }).toArray()
}

export async function getAllOrder() {
  return await ordersCol.find().toArray()
}

export async function getAllIncompleteUserOrder(userEmail: string) {
  return await ordersCol.find({ userEmail: userEmail, status: 0 }).toArray()
}

export async function getAllIncompleteOrder() {
  return await ordersCol.find({ status: 0 }).toArray()
}

export async function getOrderByID(id: string) {
  return await ordersCol.findOne({ _id: new ObjectId(id) })
}
export async function getOrderBynetsTxnRef(netsTxnRef: string) {
  return await ordersCol.findOne({ netsTxnRef: netsTxnRef })
}