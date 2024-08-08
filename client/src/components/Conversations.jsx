import React from "react";
const Conversations = ({ chat,setCurrentChat}) => {
  return (
    <div className="flex items-center justify-center h-8 w-5/6 bg-yellow-200 cursor-pointer rounded-lg" onClick={()=>setCurrentChat(chat)}>
      {chat.username}
    </div>
  );
};

export default Conversations;
