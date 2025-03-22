'use client'

import React, { useContext, useEffect } from 'react';
import { CartContext, CartProvider, productType } from '../../order/CartContext';
import { signIn, useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import useSWR, { Fetcher } from 'swr';
import useSWRImmutable from 'swr/immutable';
import Script from 'next/script';

export default function component() {
  const param = useParams()
  const { state: cart , dispatch: cartDispatch} = useContext(CartContext);
  const { data: session, status } = useSession()
  const fetcher: Fetcher<any, string> = (uri) => fetch(uri).then((res) => {console.log(res); return res.json()});
  const { data: orderData, error: orderError, isLoading: orderIsLoading } = useSWR('/api/order/' + param.id, fetcher, {refreshInterval: 5000});
  const { data: paymentData, error: paymentError, isLoading: paymentIsLoading } = useSWRImmutable('/api/payment?orderId=' + param.id, fetcher);
  const makePayment = async (orderId: any) => {
    
      // Send the data to the server in JSON format.
      const JSONdata = JSON.stringify({msg: {merchantTxnRef: orderId, netsTxnStatus: 0}})

      // API endpoint where we send form data.
      const endpoint = '/api/payment/skip'

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
  
  // if (paymentData){ //doesn't work due ot doubble calling
  //   let qrScript = document.createElement("script");
  //   qrScript.innerHTML = `console.log("My custome sendPayload"); sendPayLoad('${paymentData.txnReq}', '${paymentData.hmac}', '${paymentData.keyId}');`
  //   console.log(qrScript)
  //   console.log(typeof(qrScript))
  //   document.body.appendChild(qrScript)
  // }
  useEffect(function action(){
    if (paymentData){
        let qrScript = document.createElement("script");
        qrScript.innerHTML = `console.log("My custome sendPayload"); sendPayLoad('${paymentData.txnReq}', '${paymentData.hmac}', '${paymentData.keyId}');`
        console.log(qrScript)
        console.log(typeof(qrScript))
        document.body.appendChild(qrScript)
      }
    return function cleanup(){}
  }, [paymentData])
  return (
    <div style={{ marginBottom: "4rem", textAlign: "center" }}>
        <Script src="https://uat2.enets.sg/GW2/js/jquery-3.1.1.min.js" type="text/javascript"></Script>
        <Script src="https://uat2.enets.sg/GW2/pluginpages/env.jsp"></Script>
        <Script type="text/javascript" src="https://uat2.enets.sg/GW2/js/apps.js"></Script>

        <div id="anotherSection">
          <fieldset>
            <div id="ajaxResponse"></div>
          </fieldset>
        </div>
        <p>Total: {orderData?.total_cost} SGD</p>
        <p>Cart based Total: {cart.products.reduce((acc, cur) => { return { main: null, sides: [], cost: acc.cost + cur.cost }}).cost} SGD</p>
        <button
        onClick={()=>makePayment(param.id)}
        >
            Click here to skip payment
        </button>
        <div>{param.id}</div>
    </div>
  );
}