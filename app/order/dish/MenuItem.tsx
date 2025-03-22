'use client'

import React, { useContext } from 'react';
import { CartContext, CartItemNumberContext, CartProvider } from '../CartContext';

export default function MenuItem({Name, DishID, Price, ImageSrc}: {Name: string, DishID: string, Price: number, ImageSrc: string}) {
  var source = "/next.svg"
  const { state, dispatch } = useContext(CartContext);
  const { state: cartItemNumber } = useContext(CartItemNumberContext);
  let btnClassName = "side"
  let onClickAction = () => {
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
  }
  if (state.products[cartItemNumber].sides.find(side => side.id === DishID)){
    btnClassName += " selected-side";
    onClickAction = () => {
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
    }
  }
  return (
      <div className='h-full pb-2'>
        <button className='h-full' onClick={onClickAction}>
          <div className={btnClassName}>  
            {/* <div className="px-5 pb-5"> */}
              <img className="object-fill py-3" src={ImageSrc}></img>
              <div className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-300">{Name}</div>
              <br/>
              <div className="absolute bottom-0 right-0 text-lg">${Price.toFixed(2)}</div>
            {/* </div> */}
          </div>     
        </button>
      </div>
  )
}
