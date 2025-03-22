'use client'

import React, { useContext } from 'react';
import { CartContext, CartItemNumberContext, productType } from '../CartContext';
import { redirect, useRouter } from 'next/navigation';

export default function AppProducts(param: {}) {
  const { state: cart, dispatch: cartDispatch } = useContext(CartContext);
  const { state: itemNumber, dispatch: setItemNumber } = useContext(CartItemNumberContext);
  const router = useRouter();

  const handleSubmit = async (cartContent: productType[]) => {
    // Handle checking for value data below
    const data = cartContent.map((e) => {
      return {
        main_id: e.main?.id,
        side1_id: e.sides[0].id,
        side2_id: e.sides[1]?.id,
        side3_id: e.sides[2]?.id,
        side4_id: e.sides[3]?.id,
        side5_id: e.sides[4]?.id,
      }
    })

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify({ dishes: data })

    // API endpoint where we send form data.
    const endpoint = '/api/order'

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
    if (response.status == 200) {
      const result = await response.json()
      console.log("result: ", result)
      // redirect("/payment/" + result.id)
      router.push("/payment/" + result.id)
      // window.location.href = "/payment/" + result.id
    }
    else alert('An error has occured')
    console.log("function has ended")
  }

  const totalCost = cart.products.length ? cart.products.reduce((acc, cur) => { return { main: null, sides: [], cost: acc.cost + cur.cost } }).cost : 0

  return (
    <div className="content-center">
      {cart.products.map((order, index) => {
        return (
          <div key={index} className={`rounded-lg border-4 mb-1 flex flex-col items-center`}>
            <h2>{order.main?.name}</h2>
            <div>
              {order.sides.map((side) => {
                return <div key={side.name}>{side.name}<br /></div>
              })}
            </div>
            <p>Cost: {order.cost.toFixed(2)} SGD</p>
            <button
              className={`w-full purple btn-sm`}
              onClick={() => {
                setItemNumber({ type: 'SET', payload: index });
                router.replace("dish")
              }}>
              Edit
            </button>
            <button className="w-full btn-sm red"
              onClick={() => {
                if (itemNumber === index) setItemNumber({ type: 'SET', payload: 0 })
                cartDispatch({
                  type: "REMOVE ORDER", payload: { orderid: index, item: { id: "", name: "", price: 0 } }
                })
              }}>Delete</button></div>
          )
      })}
      <h2 className='text-center'>Total: {totalCost.toFixed(2)} SGD</h2>
      <button
        className="w-full btn-sm purple"
        onClick={() => {
          cartDispatch({ type: "ADD ORDER", payload: { orderid: 0, item: { id: "", name: "", price: 0 } } });
          setItemNumber({ type: 'SET', payload: cart.products.length })
          router.replace("dish")
        }}
      >Add another dish
      </button>
      <button className="w-full btn-sm green" onClick={() => { handleSubmit(cart.products); }}>Place Order</button>
    </div>
  );
};