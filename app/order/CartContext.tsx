"use client";

import React, { Dispatch, createContext, useReducer, Reducer } from "react"

type mainOrSide = {
    id: string,
    name: string,
    price: number
}

export type productType = {
    main: mainOrSide | null
    sides: Array<mainOrSide>
    cost: number
}

type initialStateType = {
    products: productType[]
}

const initialState = {
    products: [{main: null, sides:[], cost: 0}]
}

type actionType ={
    type : string
    payload: { orderid: number, item: mainOrSide }
}

export const CartContext = createContext<{
    state: initialStateType
    dispatch: Dispatch<actionType>
}>({ state: initialState, dispatch: () => null })

const productReducer = (state: initialStateType, action: actionType) => {
    console.log("nyan")
    state = structuredClone(state)
    switch (action.type) {
        case 'ADD':
            state.products[action.payload.orderid].sides.push(action.payload.item)
            state.products[action.payload.orderid].cost += Number(action.payload.item.price)
            return state

        case 'REMOVE':
            state.products[action.payload.orderid].sides = state.products[action.payload.orderid].sides.filter(item => item.id !== action.payload?.item.id)
            state.products[action.payload.orderid].cost -= Number(action.payload.item.price)
            return state

        case 'ADD MAIN':
            state.products[action.payload.orderid].main = action.payload.item
            state.products[action.payload.orderid].cost += Number(action.payload.item.price)
            return state

        case 'REMOVE MAIN':
            state.products[action.payload.orderid].main = null
            state.products[action.payload.orderid].cost -= Number(action.payload.item.price)
            return state

        case 'ADD ORDER':
            state.products.push({main: null, sides: [], cost:0})
            return state

        case 'REMOVE ORDER':
            state.products = state.products.filter((item, idx) =>  idx !== action.payload.orderid)
            return state
    
        default:
            return state
    }
}

export const CartItemNumberContext = createContext<{
    state: number
    dispatch: Dispatch<{type: string, payload: number}>
}>({ state: 0, dispatch: () => null })

const cartItemNumberReducer = (state: number, action: {type: string, payload: number}) => {
    switch (action.type) {
        case "SET":
            return action.payload
        default:
            return state
    }
}

export const CartProvider = ({children}: {children: React.ReactNode}) => {
    const [state, dispatch] = useReducer(productReducer, initialState)
    const [state2, dispatch2] = useReducer(cartItemNumberReducer, 0)
    // console.log("appProvider rUN")
    // console.log(dispatch)
    
    return (
        <CartItemNumberContext.Provider value={{state: state2, dispatch: dispatch2}}>
            <CartContext.Provider value={{state, dispatch}}>
                {children}
            </CartContext.Provider>
        </CartItemNumberContext.Provider>
    )
}