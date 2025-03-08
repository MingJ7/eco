"use client"
import React, { useState, useContext } from 'react';
import AppProducts from "./appProducts";
import { CartContext, CartItemNumberContext, productType } from '../CartContext';
import { useRouter } from 'next/navigation';



// export function ShowCart() {
// const [open, setOpen] = useState(false);
// const { state: cart , dispatch: cartDispatch} = useContext(CartContext);
// const { state: itemNumber, dispatch: setItemNumber } = useContext(CartItemNumberContext);

// return (

//   <div className="fixed flex bottom-0 items-center z-9999 w-full bg-black dark:bg-gray-200 space-x-0 justify-start">
//     <button className="text-white dark:text-black px-4 flex-1 bg-gray-800 dark:bg-gray-600 py-2 border-2" onClick={() => {{cartDispatch({type: "ADD ORDER", payload:{orderid: 0, item: {id: "", name:"", price: 0}}})};{setItemNumber({type: 'SET', payload:cart.products.length})}}}>Add another dish</button>
//     <button className="text-white dark:text-black px-4 flex-1 bg-gray-800 dark:bg-gray-600 py-2 border-2 border-l-0" onClick={() => setOpen(!open)}>Check Cart</button>
//     <button className="text-white dark:text-black px-4 flex-1 bg-gray-800 dark:bg-gray-600 py-2 border-2 border-l-0" onClick={() => setOpen(!open)}>Back to Order</button>
//     <div className="absolute bottom-0 left-0 flex-row flex">
//       <div
//         className={"visible lg:w-120 w-screen flex flex-col h-screen p-3 bg-white dark:bg-gray-500 shadow duration-50"}
//       >
//           <AppProducts {...{setOpen: setOpen}}/> 
//       </div>
//     </div>
//   </div>

// );
// }

export default function ShowCart2() {
    const { state: cart, dispatch: cartDispatch } = useContext(CartContext);
    const { state: itemNumber, dispatch: setItemNumber } = useContext(CartItemNumberContext);
    const router = useRouter();

    return (
        <div className=''>
            <AppProducts/>
            <button
                className="text-white dark:text-black px-4 flex-1 bg-gray-800 dark:bg-gray-600 py-2 border-2"
                onClick={() => {
                    cartDispatch({ type: "ADD ORDER", payload: { orderid: 0, item: { id: "", name: "", price: 0 } } });
                    setItemNumber({ type: 'SET', payload: cart.products.length })
                    router.replace("dish")
                }}
            >Add another dish
            </button>
            <div className='pusher'></div>
        </div>
    );
}