import React from "react";
import { BsChatLeftTextFill } from "react-icons/bs";
import { BsChatRightQuoteFill } from "react-icons/bs";
const ServiceBar = () => {
  return (
    <div className="flex flex-col items-center pt-4 w-12 h-screen gap-4 bg-green-500">
      <div className="flex flex-col items-center cursor-pointer">
        <BsChatLeftTextFill size={24} />
        <span className="text-xs">Chats</span>
      </div>
      <div className="flex flex-col items-center cursor-pointer">
        <BsChatRightQuoteFill size={24} />
        <span className="text-xs">Group</span>
      </div>
    </div>
  );
};

export default ServiceBar;
