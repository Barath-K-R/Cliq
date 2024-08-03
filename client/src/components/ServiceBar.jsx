import React from "react";
import { BsChatLeftTextFill } from "react-icons/bs";
const ServiceBar = () => {
  return (
    <div className="flex justify-center pt-4 w-12 h-screen bg-green-500">
      <BsChatLeftTextFill size={24} className="cursor-pointer"/>
    </div>
  );
};

export default ServiceBar;
