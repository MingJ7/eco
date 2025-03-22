"use client"
import { Iorder } from '@/lib/mongodbaccess';
import { WithId } from 'mongodb';
import { useParams } from 'next/navigation';
import useSWR, { Fetcher } from 'swr'



export default function Component() {
    const param = useParams()
    console.log(param)
    const fetcher: Fetcher<WithId<Iorder>, string> = (uri) => fetch(uri).then((res) => { console.log(res); return res.json() });
    const { data: orderData, error: orderError, isLoading: orderIsLoading, mutate } = useSWR('/api/order/' + param.id, fetcher);

    if (orderData?.status === 0) setTimeout(() => mutate(), 5000)
    return (
        <div className='flex flex-col items-center'>
            <div className='border-2 border-black rounded-lg w-min px-5'>
                <h1>Order Status</h1>
                <h2>{param.id}</h2>
                {
                    orderIsLoading ?
                        <p>Loading</p>
                        :
                        <div>
                            <div>
                                {
                                    orderData?.status === -1 ? <p>Awaiting Payment</p> :
                                    orderData?.status === 0 ? <p>Processing Order</p> :
                                        orderData?.status === 1 ? <p>Ready for collection</p> :
                                            orderData?.status === 2 ? <><p>Order Rejected</p><br /><p>Reason: {orderData.rejection_reason}</p></> :
                                                <p>An Unknwon Error has occured</p>
                                }
                            </div>
                            <br/>
                            <h3>Order details</h3>
                            {orderData?.dishes.map((dish: any, idx: number) => {
                                console.log(dish)
                                return <div key={idx}>
                                    <div>
                                        <p className="text-blue-500">{dish.main.name}</p>
                                        <p className="text-orange-500">&ensp;{dish.side1.name}</p>
                                        {dish.side2 ? <p className="text-orange-500">&ensp;{dish.side2.name}</p> : null}
                                        {dish.side3 ? <p className="text-orange-500">&ensp;{dish.side3.name}</p> : null}
                                        {dish.side4 ? <p className="text-orange-500">&ensp;{dish.side4.name}</p> : null}
                                        {dish.side5 ? <p className="text-orange-500">&ensp;{dish.side5.name}</p> : null}
                                    </div>
                                </div>
                            })}
                        </div>
                }
                <br/>
            </div>
        </div>
    )
}
