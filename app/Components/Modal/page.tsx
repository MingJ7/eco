'use client'

import Modal from "./Modal";
import useModal from "./useModal";

export default function App() {
  const { isOpen, toggle } = useModal();

  return (
    <div className="text-center">
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <button className="text-center" onClick={toggle}>Open Modal </button>
      <Modal isOpen={isOpen} toggle={toggle}>
        Hello
      </Modal>
    </div>
  );
}