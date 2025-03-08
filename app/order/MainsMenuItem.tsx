'use client'

import React, { useContext } from 'react';
import { CartContext, CartItemNumberContext, CartProvider } from './CartContext';

export default function MainsMenuItem({Name, DishID, Price, ImageSrc}: {Name: string, DishID: string, Price: number, ImageSrc: string}) {
  const { state, dispatch } = useContext(CartContext);
  const { state: cartItemNumber } = useContext(CartItemNumberContext);
    return (
      <div>
        {state.products[cartItemNumber].main?.id === DishID ? 
        
        //if item is in the cart
              <button onClick={() => {
                      dispatch({
                          type: 'REMOVE MAIN',
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
            <div className="px-3 w-full max-w-sm bg-blue-500 border border-gray-200 rounded-lg shadow dark:bg-blue-800 dark:border-blue-700">
              <div className="px-3 pb-3">
                <img className="object-fill py-3" src={ImageSrc}></img>
                <h5 className="md:text-xl text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-300">{Name}</h5>
              </div>
            </div>
          </button>
        
        :
        //if the item is not in the cart
            <button onClick={() => {
                      dispatch({
                          type: 'ADD MAIN',
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
            <div className="px-3 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-600 dark:border-gray-500">
              <div className="px-3 pb-3">
                <img className="object-fill py-3" src={ImageSrc}></img>
                <h5 className="md:text-xl text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-300">{Name}</h5>
              </div>
            </div>
          </button>
        }
      </div>
  )
}
