import React, { useEffect, useState, useRef } from "react";
import { CiUser } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import MessageActionModal from "./MessageActionModal.jsx";

import {
  getMessages,
  addMessage,
  retrieveMembers,
  addReadReciept,
  updateReadReciepts,
} from "../api/ChatApi";
const ChatBox = ({
  chat,
  currentUser,
  chatType,
  setSendMessage,
  receivedMessage,
  onlineUsers,
}) => {
  const [isGroup, setIsGroup] = useState(false);
  const [chatMembers, setchatMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageActionIndex, setmessageActionIndex] = useState(null);

  const messagesEndRef = useRef(null);

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom on new message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //checking chat is group or direct
  useEffect(() => {
    if (chat?.Chat.name) setIsGroup(true);
    else setIsGroup(false);
  }, [chat]);

  //fetch group memebers
  useEffect(() => {
    const getChatMembers = async () => {
      const response = await retrieveMembers(chat?.chat_id);
      setchatMembers(response.data);
    };
    getChatMembers();
  }, [chat]);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat?.chat_id);
        setMessages(data);

        const unseenMessages = data
          .filter((message) => {
            if (
              message?.ReadReciepts?.length > 0 &&
              message?.ReadReciepts[0]?.seen_at === null &&
              message.sender_id !== currentUser.id
            )
              return message;
          })
          .map((message) => message.id);

        if (unseenMessages.length > 0) {
          console.log("unseen messages are gtraeter than zero");
          const updatedReadRecieptsResponse = await updateReadReciepts({
            messageIds: unseenMessages,
            userId: currentUser.id,
            date: Date.now(),
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  //handling sent messages
  const handleSend = async (e) => {
    e.preventDefault();
    const userIds = chatMembers
      .filter((user) => user.user_id !== currentUser.id)
      .map((user) => user.user_id);

    const createdAt = Date.now();

    const newMessageData = {
      createdAt: createdAt,
      ReadReciepts: [
        {
          seen_at: onlineUsers.some((user) => user.userId === userIds[0])
            ? createdAt
            : null,
        },
      ],
      username: currentUser.username,
      sender_id: currentUser.id,
      message: newMessage,
      chatId: chat.chat_id,
      chatType: chatType,
    };

    // send message to socket server
    setSendMessage({ ...newMessageData, userIds });
    setMessages((prev) => [...prev, newMessageData]);

    // send message to database
    try {
      const newMessageResponse = await addMessage(newMessageData);

      const readRecieptResponse = await addReadReciept(
        {
          userIds: userIds,
          date: onlineUsers.some((user) => user.userId === userIds[0])
            ? createdAt
            : null,
        },
        newMessageResponse.data.id
      );

      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  // Receive Message from parent component
  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chat?.chat_id) {
      setMessages((prev) => [...prev, receivedMessage]);
    }
  }, [receivedMessage]);

  const convertDateTime = (dateStr) => {
    const date = new Date(dateStr);

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    const minutesStr = minutes < 10 ? "0" + minutes : minutes;

    const timeString = `${hours}:${minutesStr} ${ampm}`;
    return timeString;
  };
  return (
    <div className="flex flex-col relative h-screen w-full bg-slate-100 z-0">
      {/* Chat header */}
      <div className="flex items-center h-12 border border-solid border-gray-500 shadow-2xl bg-white p-4 gap-2">
        <div className="w-1/6 border border-gray-100 shadow-sm cursor-pointer">
          <h1 className="font-semibold text-xl ">
            {chat?.Chat.name ? chat.Chat.name : chat?.User.username}
          </h1>
        </div>
        <div className="flex justify-center items-center cursor-pointer">
          <CiUser size={22} />
          <span>{chatMembers.length}</span>
        </div>
      </div>

      {/* Scrollable message display */}
      <div className="flex-1 flex flex-col gap-4 bg-white p-4 overflow-scroll">
        {messages.map((message, index) => {
          const isCurrentUser = message.sender_id === currentUser.id;
          return (
            <div
              key={index}
              className={`parent relative inline-block max-w-max p-2 rounded-lg ${
                isCurrentUser
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-black self-start"
              }`}
              onMouseOver={() => setmessageActionIndex(index)}
              onMouseLeave={() => setmessageActionIndex(null)}
            >
              {messageActionIndex === index && <MessageActionModal />}

              <span className="font-bold">
                {isGroup &&
                  message.sender_id !== currentUser.id &&
                  message?.User?.username}
              </span>
              <p className="text-base">{message.message}</p>
              <div className="flex w-full justify-end items-center gap-2">
                <span className="text-xs">
                  {convertDateTime(message?.createdAt)}
                </span>
                {message?.ReadReciepts?.length === 1 &&
                  message.ReadReciepts[0].seen_at &&
                  message.sender_id === currentUser.id && <FiEye size={10} />}
              </div>
            </div>
          );
        })}
        {/* Scroll to bottom reference */}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed message input */}
      <div className="sticky border bottom-0 flex justify-around items-center focus:border-none focus:outline-none w-full h-12 bg-green-400 border-t border-gray-400 p-4">
        <input
          type="text"
          className="h-6 w-5/6 rounded-xl"
          value={newMessage}
          onChange={handleChange}
        />
        <button
          className="h-7 w-14 bg-blue-500 rounded-md"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
