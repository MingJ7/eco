'use client'

import { Iside } from '@/lib/mongodbaccess';
import MenuItem from './MenuItem'
import React from 'react';

interface IsidesWithID extends Iside {
  _id: string
}

export default function Menu({ItemList}: {ItemList: Array<IsidesWithID>}) {

  return (
    <div className="md:mb-32 mb-10 md:mx-10 mx-1 grid text-center lg:mb-0 grid-cols-2 lg:grid-cols-4">
      {
        ItemList.map((item) => {
          console.log(item)
          return (
            <MenuItem
              key={item._id}
              Name={item.name}
              DishID={item._id}
              Price={item.cost}
              ImageSrc={item.image}
            />
          )
        })
      }
    </div>
  )
}