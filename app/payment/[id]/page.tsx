'use client'

import React, { useContext } from 'react';
import { CartContext, CartProvider, productType } from '../../order/CartContext';
import { signIn, useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import useSWR, { Fetcher } from 'swr';

export default function component() {
  const param = useParams()
  const { state: cart , dispatch: cartDispatch} = useContext(CartContext);
  const { data: session, status } = useSession()
  const fetcher: Fetcher<Array<any>, string> = (uri) => fetch(uri).then((res) => {console.log(res); return res.json()});
  const { data: orderData, error: orderError, isLoading: orderIsLoading } = useSWR('/api/order/' + param.id, fetcher, {refreshInterval: 5000});
  const makePayment = async (orderId: any) => {
    
      // Send the data to the server in JSON format.
      const JSONdata = JSON.stringify({msg: {merchantTxnRef: orderId, netsTxnStatus: 0}})

      // API endpoint where we send form data.
      const endpoint = '/api/payment'

      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: {
          'Content-Type': 'application/json',
        },
        // Body of the request is the JSON data we created above.
        body: JSONdata,
      }

      // Send the form data to our forms API on Vercel and get a response.
      const response = await fetch(endpoint, options)

      // Get the response data from server as JSON.
      // If server returns the name submitted, that means the form works.
      if (response.status == 200){
        const result = await response.json()
        console.log("result: ", result)
        // redirect("/viewOrder/" + result.id)
        window.location.href = "/viewOrder/" + result.id
      }
      else alert('An error has occured')
      console.log("function has ended")
  }
  
  return (
    <div style={{ marginBottom: "4rem", textAlign: "center" }}>
        <p>Total: {orderData?.total_cost} SGD</p>
        <button
        onClick={()=>makePayment(param.id)}
        >
            Click here to skip payment
        </button>
        <div>{param.id}</div>
    </div>
  );
}