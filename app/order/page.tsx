'use client'

import Link from "next/link";
import React from 'react';
import { CartProvider } from './CartContext';
import Menu from "./Menu";
import ShowCart from "./ShowCart"
import MainsMenu from "./MainsMenu";
import useSWR, { Fetcher } from 'swr'
import CatHeaders from "./CatHeaders";

export default function component() {
  const fetcher: Fetcher<Array<any>, string> = (uri) => fetch(uri).then((res) => {console.log(res); return res.json()})
  const { data: mainsData, error: mainsError, isLoading: mainsIsLoading } = useSWR('/api/main', fetcher)
  const { data: sidesData, error: sidesError, isLoading: sidesIsLoading } = useSWR('/api/side', fetcher)

  if (mainsIsLoading || sidesIsLoading) return <h1>Loading Data...</h1>
  return (

    <div style={{ marginBottom: "4rem", textAlign: "center" }}>
        {/* <CartProvider> */}
        <CatHeaders/>
        <ShowCart/>
          <br/>
          <br/>
          <h1 className="mt-2 md:mt-5 md:text-4xl text-2xl font-bold" id="mains">Mains</h1>
          <MainsMenu
            ItemList={mainsData ?? [{_id:2, name:"loaded placeholder 2"}, {_id:3, name:"loaded placeholder 3"}]}
          />
          <h1 className="mt-2 md:mt-5 md:text-4xl text-2xl font-bold" id="meat">Meat</h1>
          <Menu
            ItemList={sidesData?.filter((side) => side.type === "meat") ?? []}
          />
          <h1 className="mt-2 md:mt-5 md:text-4xl text-2xl font-bold" id="fish">Fish</h1>
          <Menu
            ItemList={sidesData?.filter((side) => side.type === "fish") ?? []}
          />
          <h1 className="mt-2 md:mt-5 md:text-4xl text-2xl font-bold" id="veg">Veg</h1>
          <Menu
            ItemList={sidesData?.filter((side) => side.type === "veg") ?? []}
          />
          <h1 className="mt-2 md:mt-5 md:text-4xl text-2xl font-bold" id="other">Others</h1>
          <Menu
            ItemList={sidesData?.filter((side) => side.type === "other") ?? []}
          />
        {/* </CartProvider> */}
    </div>
  );
}