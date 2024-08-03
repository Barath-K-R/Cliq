import React, { useEffect, useState } from "react";
import { getUser } from "../api/UserApi.js";
const Conversations = ({ chat, currentUser,setCurrentChat}) => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const userId = chat.members.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        console.log(data);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, []);
  return (
    <div className="flex items-center h-10 w-5/6 bg-yellow-200 cursor-pointer rounded-lg" onClick={()=>setCurrentChat(chat)}>
      {userData?.username}
    </div>
  );
};

export default Conversations;
