"use client"
import useSWR, { Fetcher } from 'swr'
import ModButtons from './modificationButtons';
import RejectComponent from './rejectPane';
import useModal from "@/app/Components/Modal/useModal"



export default function Component() {
  const { isOpen, toggle } = useModal();

  const fetcher: Fetcher<Array<any>, string> = (uri) => fetch(uri).then((res) => {console.log(res); return res.json()});
  const { data: orderData, error: orderError, isLoading: orderIsLoading } = useSWR('/api/admin/order', fetcher, {refreshInterval: 5000});

  return (
    <div>
      {/* <h1>Orders</h1> */}
      {orderData?.map((order) =>{
        const dishes = order.dishes
        return (
        <div key={order._id.toString()} className='border-2 border-black'>
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
          <ModButtons {...{id: order._id.toString()}}/>
          <button className="w-full max-w-sm bg-red-500 border border-gray-200 rounded-lg shadow dark:bg-red-800 dark:border-red-700" 
            onClick={toggle}>Rejected</button>
            {orderData ? <RejectComponent isOpen={isOpen} toggle={toggle} {...{order: order}}></RejectComponent> : <h2>No Data</h2>}
          </div>
        </div>
        )
      })}
    </div>
  )
}
