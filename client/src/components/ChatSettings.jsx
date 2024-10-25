import React from "react";
import { deleteMessages } from "../api/ChatApi.js";

const ChatSettings = ({ chat,setMessages, setchatSettingsOpened }) => {
  const handleClearChat = async () => {
    console.log("clearing");
    try {
      const clearMessageResponse = await deleteMessages(chat.chat_id);
      console.log(clearMessageResponse);
      if(clearMessageResponse)
        setMessages([]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="absolute w-28 right-8 top-6 p-2 shadow-md bg-white"
      onMouseLeave={() => setchatSettingsOpened(false)}
    >
      <ul className="space-y-2">
        <li
          className="hover:bg-gray-100 px-2 cursor-pointer"
          onClick={handleClearChat}
        >
          clear chat
        </li>
        <li className="hover:bg-gray-100 px-2 cursor-pointer">chat info</li>
      </ul>
    </div>
  );
};

export default ChatSettings;
