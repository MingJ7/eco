'use client'

import React, { useContext } from 'react';
import { CartContext, CartItemNumberContext, CartProvider } from '../CartContext';

export default function MainsMenuItem({ Name, DishID, Price, ImageSrc }: { Name: string, DishID: string, Price: number, ImageSrc: string }) {
  const { state, dispatch } = useContext(CartContext);
  const { state: cartItemNumber } = useContext(CartItemNumberContext);
  let btnClassName = "main-item"
  let onClickAction = () => {
    dispatch({
      type: 'ADD MAIN',
      payload: {
        orderid: cartItemNumber,
        item: {
          id: DishID,
          name: Name,
          price: Price,
        }
      }
    })
  }
  if (state.products[cartItemNumber].main?.id === DishID) {
    btnClassName += " selected-main-item"
    onClickAction = () => {
      dispatch({
        type: 'REMOVE MAIN',
        payload: {
          orderid: cartItemNumber,
          item: {
            id: DishID,
            name: Name,
            price: Price,
          }
        }
      })
    }
  }
  return (
    <div>
      <button onClick={onClickAction}>
        <div className={btnClassName}>
          <div className="px-3 pb-3">
            <img className="object-fill py-3" src={ImageSrc}></img>
            <h5 className="md:text-xl text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-300">{Name}</h5>
          </div>
        </div>
      </button>
    </div>
  )
}
