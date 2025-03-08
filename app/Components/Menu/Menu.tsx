"use client"
import MenuItem from './MenuItem'
import { useState } from 'react'

export default function Menu({ItemList}: {ItemList: Array<string>}) {
  const [itemList, setItemList] = useState(ItemList);

  return (
    <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
      {
        itemList.map((item) => {
          return (
            <MenuItem
              imageSrc="sss"
              Name={item}
              QtyLeft={5}
            />
          )
        })
      }
    </div>
  )
}
