import React,{useEffect} from "react";
import { getAllOrgUser } from "../api/UserApi";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
const UserSearchModal = () => {
    useEffect(() => {
      const fetchOrgUsers=async()=>{
          try {
            const response=await getAllOrgUser();
            console.log(response)
          } catch (error) {
            
          }
      }
    
      
    }, [])
    
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-55 " />
      <div className="relative w-3/6 h-4/6 bg-white rounded-lg shadow-lg ">
        <div className="flex justify-between items-center w-full h-10 p-6 bg-gray-100">
          <span className="font-semibold text-xl">Send a Direct Message</span>
          <AiFillCloseCircle size={24} className="cursor-pointer" />
        </div>
        <div className="flex justify-center pt-6">
          <div className="flex items-center gap-2 border pl-2 w-4/6 h-10 border-b-gray-200">
            <AiOutlineSearch size={24} className="cursor-pointer"/>
            <input type="text" placeholder="Search"  className="w-full border border-gray-300 focus:border-blue-500 focus:outline-none rounded px-4 py-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;
