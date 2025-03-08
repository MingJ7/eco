'use client'

import React, { useContext } from 'react';
import { CartContext, CartItemNumberContext, CartProvider } from './CartContext';

export default function MenuItem({Name, DishID, Price, ImageSrc}: {Name: string, DishID: string, Price: number, ImageSrc: string}) {
  var source = "/next.svg"
  const { state, dispatch } = useContext(CartContext);
  const { state: cartItemNumber } = useContext(CartItemNumberContext);
  return (
      <div>
        {state.products[cartItemNumber].sides.find(side => side.id === DishID) ? 
        
        //if item is in the cart
              <button 
              className="px-3 w-full max-w-sm bg-orange-500 border border-gray-200 rounded-lg shadow dark:bg-orange-700 dark:border-orange-600"

              onClick={() => {
                      dispatch({
                          type: 'REMOVE',
                          payload: {
                              orderid: cartItemNumber,
                              item:{
                                id: DishID,
                                name: Name,
                                price: Price,
                              }
                          }
                      })
                  }}>       
              <div className="px-5 pb-5">
                <img className="object-fill py-3" src={ImageSrc}></img>
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-300">{Name}</h5>
              </div>
          </button>
        
        :
        //if the item is not in the cart
            <button 
            className="px-3 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-600 dark:border-gray-500"
            
            onClick={() => {
                      dispatch({
                          type: 'ADD',
                          payload: {
                              orderid:cartItemNumber,
                              item:{
                                id: DishID,
                                name: Name,
                                price: Price,
                              }
                          }
                      })
                  }}>
              <div className="px-5 pb-5">
                <img className="object-fill py-3" src={ImageSrc}></img>
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-300">{Name}</h5>
            </div>
          </button>
        }
      </div>
  )
}
