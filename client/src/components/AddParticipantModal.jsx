import React, { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
const AddParticipantModal = ({ chat, setAddParticipantModalOpened }) => {
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-55 " />
      <div className="relative bottom-0 flex flex-col items-center gap-7 w-3/6 h-[94%] bg-white rounded-lg shadow-lg ">
        {/* title */}
        <div className="flex justify-between items-center w-full h-10 p-6 bg-gray-100">
          <span className="font-semibold text-xl">{chat.Chat?.name}</span>
          <AiFillCloseCircle size={24} className="cursor-pointer" onClick={()=>setAddParticipantModalOpened(false)}/>
        </div>

        {/* search div */}
        <div className="flex items-center gap-2 border pl-2 w-5/6 h-10 border-b-gray-200">
          <AiOutlineSearch size={24} className="cursor-pointer" />
          <input
            type="text"
            placeholder="Search"
            className="w-full border border-gray-300 focus:border-blue-500 focus:outline-none rounded px-4 py-2"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default AddParticipantModal;
