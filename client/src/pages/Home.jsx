import React, { useRef, useState, useEffect } from "react";
import Conversations from "../components/Conversations.jsx";
import ChatBox from "../components/ChatBox.jsx";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.js";
import { userChats } from "../api/ChatApi.js";
import { useSelector } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import { CiMap } from "react-icons/ci";
import { CiReceipt } from "react-icons/ci";
import { CiServer } from "react-icons/ci";
import "../styles/Home.css";
const Home = () => {
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [createChatModal, setCreateChatModal] = useState(false);

  const user = useSelector((state) => state.user.authUser);
  const chatType = useSelector((state) => state.selection.selection);
  const socket = useRef();
  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      let response;
      try {
        switch (chatType) {
          case "direct":
            response = await userChats(user.id, chatType);
            break;
          case "group":
            response = await userChats(user.id, chatType);
            break;
          default:
            break;
        }
        setChats(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [chatType]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("http://localhost:8800");
    socket.current.emit("new-user-add", user.id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      console.log("emitting");
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log("recieved message");
      console.log(data);
      setReceivedMessage(data);
    });
  }, []);
  return (
    <>
      <div className="flex w-full">
        <div className="flex flex-col items-center relative w-56 pt-4 gap-4 bg-blue-900">
          <section className="flex justify-center items-center p-2 gap-6">
            <span className="text-base text-white">Conversations </span>
            <div className="flex justify-center items-center w-4 rounded-full cursor-pointer hover:bg-gray-400  bg-slate-50" onClick={()=>setCreateChatModal(prev=>!prev)}>
              <AiOutlinePlus size={17} />
            </div>
            {createChatModal && (
              <div className="create-chat-modal flex flex-col w-56 h-22 absolute top-12 left-40 shadow-xl list-none bg-white">
                <section className="flex gap-2 pl-1 items-center cursor-pointer">
                  <CiMap />
                  <span>Send a direct Message</span>
                </section>
                <section className="flex gap-2 pl-1 items-center cursor-pointer">
                  <CiReceipt />
                  <span>Start a Group conversation</span>
                </section>
                <section className="flex gap-2 pl-1 items-center cursor-pointer">
                  <CiServer />
                  <span>Create a channel</span>
                </section>
              </div>
            )}
          </section>

          {chats.map((chat) => {
            return (
              <Conversations
                chat={chat}
                currentUserId={user.id}
                setCurrentChat={setCurrentChat}
                key={chat._id}
              />
            );
          })}
        </div>

        <ChatBox
          chat={currentChat}
          currentUser={user}
          chatType={chatType}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </>
  );
};

export default Home;
