"use client"

import { Imains, Iorder, Iside } from "@/lib/mongodbaccess"
import { WithId } from "mongodb"
import { FormEvent, useState } from "react"

export default function RejectComponent({order, setSelected}: {order: WithId<Iorder>, setSelected: (arg0: WithId<Iorder>|undefined)=>void }) {
    if (!order) return null;

    const getMainAndSide = function (order: Iorder) {
        const mainSet: Set<WithId<Imains>> = new Set()
        const sideSet: Set<WithId<Iside>> = new Set()
        order.dishes.forEach(dish => {
            mainSet.add(dish.main)
            sideSet.add(dish.side1)
            if (dish.side2) sideSet.add(dish.side2)
            if (dish.side3) sideSet.add(dish.side3)
            if (dish.side4) sideSet.add(dish.side4)
            if (dish.side5) sideSet.add(dish.side5)
        });
        return { mainSet, sideSet };
    }

    const { mainSet, sideSet } = getMainAndSide(order)
    const [showSubReason, setShowSubReason] = useState(true)

    const attemptReject = async function (event: FormEvent<HTMLFormElement>) {
        console.log(event)
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()

        // Get data from the form.
        const form = event.target as HTMLFormElement
        const selList: Array<string> = []
        for (const inputElement of form.subReason.values()) {
            if (inputElement.checked) selList.push(inputElement.value)
        }
        const data = {
            id: order._id.toString(),
            mainReason: form.mainReason.value,
            subReason: selList,
            status: 2
        }
        // Form the request for sending data to the server.
        const options = {
            // The method is POST because we are sending data.
            method: 'POST',
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
            },
            // Body of the request is the JSON data we created above.
            body: JSON.stringify(data),
        }
        console.log("formData: ", data)
        const response = await fetch("/api/admin/order", options)
        if (response.status == 200) {
            setSelected(undefined)
            alert("rejected")
        }
    }
    return (
        <div className="z-9999 fixed w-screen h-screen inset-y-0 bg-black flex justify-center items-center">
            <div className="block bg-white dark:bg-gray-500 w-5/6 md:w-3/4 h-4/10 md:h-3/4 p-4 rounded-2xl dark:text-black">
                <button className="float-right btn-sm red" onClick={()=>setSelected(undefined)}>x</button>
                <h1>Rejecting Order</h1>
                <h2>{order._id.toString()}</h2>
                <form onSubmit={attemptReject}>
                    <input type="radio" id="closedRadioBtn" name="mainReason" value="closed" required={false} onClick={() => setShowSubReason(true)}></input>
                    <label htmlFor="closedRadioBtn">Store Closed</label><br />
                    <input type="radio" id="noStockRadioBtn" name="mainReason" value="Out of Stock" onClick={() => setShowSubReason(false)}></input>
                    <label htmlFor="noStockRadioBtn">Out of Stock</label><br />

                    <div id="itemList" className="px-4" hidden={showSubReason}>
                        {Array.from(mainSet, (main) =>
                            <div key={main.name}>
                                <input type="checkbox" name="subReason" value={main._id.toString()} />
                                <label>{main.name}</label><br />
                            </div>)}
                        {Array.from(sideSet, (side) =>
                            <div key={side.name}>
                                <input type="checkbox" name="subReason" value={side._id.toString()} />
                                <label>{side.name}</label><br />
                            </div>)}
                    </div>

                    <button type="submit" className="btn red">Reject</button>
                </form>
            </div>
        </div>
    )

}