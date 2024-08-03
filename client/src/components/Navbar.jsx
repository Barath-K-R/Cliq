import React from 'react'
import { BsMessenger } from "react-icons/bs";
const Navbar = () => {
  return (
    <div className='flex w-screen h-10 bg-blue-600'>
        <div className="flex items-center gap-2 ml-4">
          <BsMessenger size={22}/>
          <h2>Cliq</h2>
        </div>
    </div>
  )
}

export default Navbar