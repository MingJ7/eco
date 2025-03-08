"use client"
import { Imains } from "@/lib/mongodbaccess"
import useSWR, { Fetcher } from 'swr'

interface ImainWithID extends Imains {
    _id: string
}

export default function MainstBody() {
    const fetcher: Fetcher<Array<ImainWithID>, string> = (uri) => fetch(uri).then((res) => {console.log(res); return res.json()})
    const { data: mainsData, error: mainsError, isLoading: mainsIsLoading, mutate: mainMutate} = useSWR('/api/main', fetcher)

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
        const response = await fetch("/api/admin/main", options)
        if (response.status == 200) {
            mainMutate()
        }else{
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
            body: JSON.stringify({ id: id, status: 1 }),
        }
        const response = await fetch("/api/admin/main", options)
        if (response.status == 200) {
            mainMutate()
        }else{
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
            body: JSON.stringify({ id: id, status: 0 }),
        }
        const response = await fetch("/api/admin/main", options)
        if (response.status == 200) {
            mainMutate()
        }else{
            alert(response.statusText)
        }
    }

    if (mainsIsLoading) return <h1>Loading Data</h1>
    if (mainsError) return <h1>An Error has occured, try agian later</h1>
    return (
        <table>
            <thead>
                <tr>
                    <th>EN Name</th>
                    <th>CN Name</th>
                    <th>Image</th>
                    <th>Cost</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {mainsData?.map((main) => (
                    <tr key={main._id}>
                        <td>{main.name}</td>
                        <td>{main.cnName}</td>
                        <td><img src={main.image}></img></td>
                        <td>{main.cost}</td>
                        <td>
                            <div><button onClick={() => attemptDelete(main._id)}>Delete</button></div>
                            {
                                main.status === 1 ?
                                <div><button onClick={() => attemptDisable(main._id)}>Disable</button></div>
                                :
                                <div><button onClick={() => attemptEnable(main._id)}>Enable</button></div>
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )

}