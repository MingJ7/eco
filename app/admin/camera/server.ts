"use server"

import { updateSide } from "@/lib/mongodbaccess"
import { sideList } from "@/lib/mongodbVarCache"

export async function updateFromMLResult(formData: FormData) {
    "use server"
    // Post via axios or other transport method
    fetch("http://localhost:5000/", {method: "POST", body: formData}).then((res) => res.json().then(async (j) => {
        for (const to_remove of j.to_remove_list){
              const ok = await updateSide(to_remove, null, null, 0)
              console.log(ok)
              if (!ok) console.log(to_remove, "failed to update")
        }
        for (const to_add of j.to_add_list){
              const ok = await updateSide(to_add, null, null, 40)
              console.log(ok)
              if (!ok) console.log(to_add, "failed to update")
        }
    })).catch((err) => console.log(err))
}

export async function getMLResult(formData: FormData) {
    "use server"
    // Post via axios or other transport method
    return fetch("http://localhost:5000/box", {method: "POST", body: formData}).then((res) => res.json().then(async (j) => {
        for (const side of sideList){
            if (j.names.includes(side.name)){
                if (side.expected_remainder <= 0 ){
                    const ok = await updateSide(side._id.toString(), null, null, 40)
                    console.log(ok)
                    if (!ok) console.log(side, "failed to update")
                }
            }else{
                if (side.expected_remainder > 0 ){
                    const ok = await updateSide(side._id.toString(), null, null, 0)
                    console.log(ok)
                    if (!ok) console.log(side, "failed to update")
                }
            }
        }
        return j
    })).catch((err) => console.log(err))
}