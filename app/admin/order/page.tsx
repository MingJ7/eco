"use client"
import useSWR, { Fetcher } from 'swr'
import RejectComponent from './rejectPane';
import { useState } from 'react';

export default function Component() {
  const [ selectedData, setSelectedData ] = useState<any>()

  const fetcher: Fetcher<Array<any>, string> = (uri) => fetch(uri).then((res) => {console.log(res); return res.json()});
  const { data: orderData, error: orderError, isLoading: orderIsLoading } = useSWR('/api/admin/order', fetcher, {refreshInterval: 5000});

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
    if (response.status != 200) {
        alert("An Error has occured")
    }
  }

  return (
    <div className='flex flex-col items-center'>
      {orderData?.map((order) =>{
        const dishes = order.dishes
        return (
        <div key={order._id.toString()} className='border-2 border-black w-fit px-5 rounded-lg mb-1'>
          <div>Order #{order._id.toString()}</div>
          {dishes?.map((dish: any, idx: number) => { 
            console.log(dish)
            return <div key={idx}>
              <div>
                <p className ="text-blue-500">{dish.main.name}</p>
                <p className ="text-orange-500">&ensp;{dish.side1.name}</p>
                <p className ="text-orange-500">&ensp;{dish.side2?.name}</p>
                <p className ="text-orange-500">&ensp;{dish.side3?.name}</p>
                <p className ="text-orange-500">&ensp;{dish.side4?.name}</p>
                <p className ="text-orange-500">&ensp;{dish.side5?.name}</p>
              </div>
            </div>
          })}
          <div className='w-full border-black'>
          <button className="w-full max-w-sm btn green" 
            onClick={() => attemptComplete(order._id.toString())}>Complete</button>
          <button className="w-full max-w-sm btn red" 
            onClick={()=>setSelectedData(order)}>Reject</button>
          </div>
        </div>
        )
      })}
      <RejectComponent order={selectedData} setSelected={setSelectedData}/>
    </div>
  )
}
