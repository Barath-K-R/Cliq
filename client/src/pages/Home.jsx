import React, { useRef, useState, useEffect } from "react";
import Conversations from "../components/Conversations.jsx";
import ChatBox from "../components/ChatBox.jsx";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.js";
import { userChats } from "../api/ChatApi.js";
const Home = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const socket = useRef();

  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user.user_id);
        console.log(data)
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user?.user_id]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("http://localhost:8800");
    socket.current.emit("new-user-add", user.user_id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  // Send Message to socket server
  useEffect(() => {
    console.log(sendMessage)
    if (sendMessage !== null) {
      console.log("emitting")
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data);
      setReceivedMessage(data);
    });
  }, []);
  return (
    <>
      <div className="flex w-full">
        <div className="flex flex-col items-center w-56 pt-4 gap-4 bg-black">
          <section className="">
          <span className="text-base text-white">Conversations  </span>
          <span className="text-gray-50">+</span>
          </section>
          
          {chats.map((chat) => {
            return (
              <Conversations
                chat={chat}
                currentUser={user._id}
                setCurrentChat={setCurrentChat}
                key={chat._id}
              />
            );
          })}
        </div>

        <ChatBox
          chat={currentChat}
          currentUser={user.user_id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </>
  );
};

export default Home;
