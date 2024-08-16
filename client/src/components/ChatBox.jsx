import React, { useEffect, useState } from "react";
import { getUser } from "../api/UserApi";
import { getMessages, addMessage, retrieveMembers } from "../api/ChatApi";
const ChatBox = ({ chat, currentUser,chatType, setSendMessage, receivedMessage }) => {
  const [isGroup, setIsGroup] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  //checking chat is group or direct
  useEffect(() => {
    if (chat?.name) setIsGroup(true);
    else setIsGroup(false);
  }, [chat]);

  //fetch group memebers
  useEffect(() => {
    const getChatMembers = async () => {
      const response = await retrieveMembers(chat?.chat_id);

      setGroupMembers(response.data);
    };
    getChatMembers();
  }, [chat]);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat?.chat_id);
        console.log(data)
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleSend = async (e) => {
    e.preventDefault();
    const userIds = groupMembers.filter(
      (user) => user.user_id !== currentUser.id
    ).map(user=>user.user_id);
    const message = {
      username:currentUser.username,
      senderId: currentUser.id,
      message: newMessage,
      chatId: chat.chat_id,
      chatType:chatType
    };

    // send message to socket server
    setSendMessage({ ...message, userIds });

    // send message to database
    try {
      const { data } = await addMessage(message);
      console.log(data)
      setMessages([...messages, data]);
      setNewMessage("");
    } catch {
      console.log("error");
    }
  };

  // Receive Message from parent component
  useEffect(() => {
    console.log("Message Arrived: ", receivedMessage);
    if (receivedMessage !== null && receivedMessage.chatId === chat?.chat_id) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-100">
      <div className="flex-10 flex items-center h-12 border border-solid border-gray-500 shadow-2xl bg-white p-4">
        <h1>{chat?.name ? chat.name : chat?.username}</h1>
      </div>
      <div className="flex-1 flex flex-col gap-4 bg-white p-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.sender_id === currentUser.id;
          return (
            <div
              key={index}
              className={`inline-block max-w-max p-2 rounded-lg ${
                isCurrentUser
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              <span className="font-bold">{isGroup && message.username}</span>
              <p>{message.message}</p>
            </div>
          );
        })}
      </div>
      <div className="flex-10 flex h-12 bg-green-400 border border-gray-400 p-4">
        <input
          type="text"
          className="h-6 w-5/6 rounded-xl"
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
