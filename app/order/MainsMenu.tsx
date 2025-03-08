'use client'

import { Imains } from '@/lib/mongodbaccess';
import MainsMenuItem from './MainsMenuItem'
import React from 'react';

interface ImainsWithID extends Imains {
  _id: string
}

export default function MainsMenu({ItemList}: {ItemList: Array<ImainsWithID>}) {

  return (
    //remove mx-1 to remove paddings at the side
    <div className="md:mb-32 mb-10 md:mx-10 mx-1 grid text-center lg:mb-0 grid-cols-2 lg:grid-cols-4">
      {
        ItemList.map((item) => {
          return (
            <MainsMenuItem
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