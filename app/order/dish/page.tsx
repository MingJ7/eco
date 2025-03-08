'use client'

import Link from "next/link";
import React from 'react';
import { CartProvider } from '../CartContext';
import Menu from "./Menu";
import ShowCart from "./ShowCart"
import MainsMenu from "./MainsMenu";
import useSWR, { Fetcher } from 'swr'
import CatHeaders from "./CatHeaders";
import { useRouter } from "next/navigation";

export default function component() {
  const fetcher: Fetcher<Array<any>, string> = (uri) => fetch(uri).then((res) => { console.log(res); return res.json() })
  const { data: mainsData, error: mainsError, isLoading: mainsIsLoading } = useSWR('/api/main', fetcher)
  const { data: sidesData, error: sidesError, isLoading: sidesIsLoading } = useSWR('/api/side', fetcher)
  const router = useRouter()

  if (mainsIsLoading || sidesIsLoading) return <h1>Loading Data...</h1>
  return (

    <div style={{ marginBottom: "4rem", textAlign: "center" }}>
      <CatHeaders />
      <h1 className="cat-header" id="mains">Mains</h1>
      <MainsMenu
        ItemList={mainsData ?? []}
      />
      <h1 className="cat-header" id="meat">Meat</h1>
      <Menu
        ItemList={sidesData?.filter((side) => side.type === "meat") ?? []}
      />
      <h1 className="cat-header" id="fish">Fish</h1>
      <Menu
        ItemList={sidesData?.filter((side) => side.type === "fish") ?? []}
      />
      <h1 className="cat-header" id="veg">Veg</h1>
      <Menu
        ItemList={sidesData?.filter((side) => side.type === "veg") ?? []}
      />
      <h1 className="cat-header" id="other">Others</h1>
      <Menu
        ItemList={sidesData?.filter((side) => side.type === "others") ?? []}
      />

      <div className='pusher'></div>
      <div className="fixed bottom-0 w-full px-1">
        <button className="py-2 border-2 w-full text-white dark:text-black bg-gray-800 dark:bg-gray-600"
          onClick={() => router.replace("cart")}>
          View Cart
        </button>
      </div>
    </div>
  );
}