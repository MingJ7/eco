import React, { ReactNode, useState } from "react";
import RejectComponent from "@/app/admin/order/rejectPane";
import useSWR, { Fetcher } from 'swr'


interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

export default function Modal(props: ModalType) {
  return (
    <>
      {props.isOpen && (
        <div className="modal-overlay w-full bg-black text-white">
          <div  className="modal-box">
            <button className="float-right text-lg" onClick={props.toggle}>x</button>
            {props.children}
          </div>
        </div>
      )}
    </>
  );
}