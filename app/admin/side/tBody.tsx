"use client"
import { Iside } from '@/lib/mongodbaccess';
import useSWR, { Fetcher } from 'swr'

interface IsideWithID extends Iside {
    _id: string
}

export default function SidetBody() {
    const fetcher: Fetcher<Array<IsideWithID>, string> = (uri) => fetch(uri).then((res) => { console.log(res); return res.json() })
    const { data: sidesData, error: sidesError, isLoading: sidesIsLoading, mutate: sideMutate } = useSWR('/api/side', fetcher)

    const attemptDelete = async function (id: string) {
        // Form the request for sending data to the server.
        const options = {
            // The method is POST because we are sending data.
            method: 'DELETE',
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
            },
            // Body of the request is the JSON data we created above.
            body: JSON.stringify({ id: id }),
        }
        const response = await fetch("/api/admin/side", options)
        if (response.status == 200) {
            sideMutate()
        } else {
            alert(response.statusText)
        }
    }

    const attemptEnable = async function (id: string) {
        // Form the request for sending data to the server.
        const options = {
            // The method is POST because we are sending data.
            method: 'POST',
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
            },
            // Body of the request is the JSON data we created above.
            body: JSON.stringify({ id: id, expected_remainder: 1 }),
        }
        const response = await fetch("/api/admin/side", options)
        if (response.status == 200) {
            sideMutate()
        } else {
            alert(response.statusText)
        }
    }

    const attemptDisable = async function (id: string) {
        // Form the request for sending data to the server.
        const options = {
            // The method is POST because we are sending data.
            method: 'POST',
            // Tell the server we're sending JSON.
            headers: {
                'Content-Type': 'application/json',
            },
            // Body of the request is the JSON data we created above.
            body: JSON.stringify({ id: id, expected_remainder: 0 }),
        }
        const response = await fetch("/api/admin/side", options)
        if (response.status == 200) {
            sideMutate()
        } else {
            alert(response.statusText)
        }
    }

    if (sidesIsLoading) return <h1>Loading Data</h1>
    if (sidesError) return <h1>An Error has occured, try agian later</h1>
    return (
        <table>
            <thead>
                <tr>
                    <th>EN Name</th>
                    <th>CN Name</th>
                    <th>Image</th>
                    <th>Type</th>
                    <th>Cost</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {sidesData?.map((side) => (
                    <tr key={side._id}>
                        <td>{side.name}</td>
                        <td>{side.cnName}</td>
                        <td><img src={side.image}></img></td>
                        <td>{side.type}</td>
                        <td>{side.cost}</td>
                        <td>
                            {
                                side.expected_remainder > 0 ?
                                <div><button className="btn-sm purple" onClick={() => attemptDisable(side._id)}>Disable</button></div>
                                :
                                <div><button className="btn-sm green" onClick={() => attemptEnable(side._id)}>Enable</button></div>
                            }

                            <div><button className="btn-sm red" onClick={() => attemptDelete(side._id)}>Delete</button></div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )

}