"use client"

import Modal from "@/app/Components/Modal/Modal"
import useModal from "@/app/Components/Modal/useModal"

export default function ModButtons(props: {id: string}) {
    const { isOpen, toggle } = useModal();

    const attemptComplete = async function (id: string) {
        // Form the request for sending data to the server.
        const options = {
            // The method is POST because we are sending data.
            method: 'POST',
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
            },
            // Body of the request is the JSON data we created above.
            body: JSON.stringify({ id: id , status: 1}),
        }
        const response = await fetch("/api/admin/order", options)
        if (response.status == 200) {
            alert("completed")
        }
    }

    const attemptReject = async function (id: string) {
        // Form the request for sending data to the server.
        const options = {
            // The method is POST because we are sending data.
            method: 'POST',
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
            },
            // Body of the request is the JSON data we created above.
            body: JSON.stringify({ id: id , status: 2}),
        }
        const response = await fetch("/api/admin/order", options)
        if (response.status == 200) {
            alert("rejected")
        }
    }
    return (
        <div>
            {/* <button onClick={() => attemptDelete(props.id)}>Delete</button><br/> */}
            <button className="w-full max-w-sm bg-green-500 border border-gray-200 rounded-lg shadow dark:bg-green-800 dark:border-green-700" 
            onClick={() => attemptComplete(props.id)}>Complete</button><br/>
        </div>
    )

}