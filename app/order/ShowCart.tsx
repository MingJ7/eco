import React, { useState, useContext } from 'react';
import AppProducts from "./appProducts";
import { CartContext, CartItemNumberContext, productType } from './CartContext';



export default function ShowCart() {
const [open, setOpen] = useState(false);
const { state: cart , dispatch: cartDispatch} = useContext(CartContext);
const { state: itemNumber, dispatch: setItemNumber } = useContext(CartItemNumberContext);
   
return (

  <div className="fixed flex bottom-0 items-center z-9999 w-full bg-black dark:bg-gray-200 space-x-0 w-full justify-start">
    <button className="text-white dark:text-black px-4 flex-1 bg-gray-800 dark:bg-gray-600 py-2 border-2" onClick={() => {{cartDispatch({type: "ADD ORDER", payload:{orderid: 0, item: {id: "", name:"", price: 0}}})};{setItemNumber({type: 'SET', payload:cart.products.length})}}}>Add another dish</button>
    <button className="text-white dark:text-black px-4 flex-1 bg-gray-800 dark:bg-gray-600 py-2 border-2 border-l-0" onClick={() => setOpen(!open)}>Check Cart</button>
    <div className="absolute bottom-0 left-0 flex-row flex">
      <div
        className={` ${
          open ? "visible lg:w-120 w-screen" : "lg:w-1 w-1 hidden"
        } flex flex-col h-screen p-3 w-full bg-white dark:bg-gray-500 shadow duration-50`}
      >
        <div className="space-y-3">
          <div className="fixed flex left-0 bottom-0 items-center z-9999 w-full bg-black space-x-0 w-full justify-start ">
            <button className="text-white dark:text-black px-4 flex-1 bg-gray-800 dark:bg-gray-600 py-2 border-2" onClick={() => {{cartDispatch({type: "ADD ORDER", payload:{orderid: 0, item: {id: "", name:"", price: 0}}})};{setItemNumber({type: 'SET', payload:cart.products.length})}}}>Add another dish</button>
            <button className="text-white dark:text-black px-4 flex-1 bg-gray-800 dark:bg-gray-600 py-2 border-2 border-l-0" onClick={() => setOpen(!open)}>Back to Order</button>
          </div>
          <AppProducts {...{setOpen: setOpen}}/> 
        </div>
      </div>
    </div>

</div>
);
}

