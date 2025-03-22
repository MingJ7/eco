"use server"

import { updateSide } from "@/lib/mongodbaccess"

export async function getMLResult(formData: FormData) {
    "use server"
    // Post via axios or other transport method
    fetch("http://localhost:5000/", {method: "POST", body: formData}).then((res) => res.json().then(async (j) => {
        console.log(j)
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
