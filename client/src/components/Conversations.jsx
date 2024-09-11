import React, { useState, useEffect } from "react";
const Conversations = ({ chat, setCurrentChat, onlineUsers }) => {
  const [useronline, setuserOnline] = useState(false);
  useEffect(() => {
    const checkUserIsOnline = () => {
      setuserOnline(() =>
        onlineUsers.some((user) => user.userId === chat?.User?.id)
      );
    };
    checkUserIsOnline();
  }, [onlineUsers]);

  return (
    <div
      className="relative flex items-center justify-start bg-black bg-opacity-10 hover:bg-opacity-20 pl-4 gap-4 h-10 w-11/12 cursor-pointer rounded-lg"
      onClick={() => setCurrentChat(chat)}
    >
      {useronline && chat.Chat.chat_type === "direct" && (
        <div className="absolute h-[12px] w-[12px] bg-green-400 left-8 bottom-6 rounded-lg"></div>
      )}
      {chat.Chat.chat_type === "direct" && (
        <div className="w-6 h-6 text-center bg-white rounded-xl">
          {chat?.User?.username.charAt(0).toUpperCase()}
        </div>
      )}

      <span className="text-white">
        {chat.Chat.name ? chat.Chat.name : chat.User.username}
      </span>
    </div>
  );
};

export default Conversations;
