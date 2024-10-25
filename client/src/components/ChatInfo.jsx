import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { TiGroup } from "react-icons/ti";
const ChatInfo = ({ currentChat }) => {
  return (
    <div className="fixed flex justify-end inset-0 bg-black bg-opacity-55 z-50">
      <div className="h-full w-3/6 bg-white">
        {/* title */}
        <div className="flex justify-between items-center w-full h-10 p-6 bg-gray-100">
          <span className="font-semibold text-xl">{currentChat.Chat.name}</span>
          <AiFillCloseCircle size={24} className="cursor-pointer" />
        </div>
        <div className="info">
          <div className="profile flex">
            <TiGroup />
            <div className="name flex flex-col">
              <span>{currentChat.Chat.name}</span>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
