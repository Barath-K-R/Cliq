import React from "react";

const ChatSettings = ({
  chat,
  setchatSettingsOpened,
  setchatInfoModalOpened,
}) => {
 
  return (
    <div
      className="absolute w-28 right-8 top-6 p-2 shadow-md bg-white"
      onMouseLeave={() => setchatSettingsOpened(false)}
    >
      <ul className="space-y-2">
        <li
          className="hover:bg-gray-100 px-2 cursor-pointer"
          onClick={() => setchatInfoModalOpened(true)}
        >
          chat info
        </li>
        <li
          className="hover:bg-gray-100 px-2 text-red-500 cursor-pointer"
        >
          Leave
        </li>
      </ul>
    </div>
  );
};

export default ChatSettings;