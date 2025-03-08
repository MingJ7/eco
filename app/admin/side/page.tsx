import { getAllSide } from "@/lib/mongodbaccess"
import SidetBody from "./tBody"
import { checkAdmin } from "@/app/Components/Auth/AdminControl"


export default async function Component() {
  // await checkAdmin()

  return (
    <SidetBody />
  )
}
