import React, { useEffect, useState, useRef } from "react";
import { CiUser } from "react-icons/ci";
import { CgMailReply } from "react-icons/cg";
import { FiEye } from "react-icons/fi";
import Message from "./Message.jsx";
import MessageActionModal from "./MessageActionModal.jsx";

import {
  getMessages,
  addMessage,
  retrieveMembers,
  addReadReciept,
  updateReadReciepts,
  t,
  addMessageToThread
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
  const [replyMessage, setReplyMessage] = useState(""); 
  const [messageActionIndex, setmessageActionIndex] = useState(null);
  const [currentThreadMessages, setcurrentThreadMessages] = useState([]);
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [threadMap, setThreadMap] = useState({});
  const [replyThread, setreplyThread] = useState(null);
  
  const messagesEndRef = useRef(null);

  const buildThreadMap = () => {
    const newThreadMap = {};
    const threadMessageIds = {};

    messages.forEach((message) => {
      if (message.thread_id) {
        if (!newThreadMap.hasOwnProperty(message.thread_id)) {
          newThreadMap[message.thread_id] = [];
          threadMessageIds[message.thread_id] = new Set();
        }

        if (
          !threadMessageIds[message.thread_id]?.has(message.id) &&
          message.is_thread_head === false
        ) {
          newThreadMap[message.thread_id].push(message);
          threadMessageIds[message.thread_id]?.add(message.id);
        }
      }
    });
    console.log(newThreadMap);
    setThreadMap(newThreadMap);
  };

  const handleReplyChange = (e) => {
    setReplyMessage(e.target.value); 
  };

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  //handling threadClick
  const handleThreadClick = (thread_id, messageId) => {
    console.log(currentThreadMessages);
    if (thread_id !== expandedThreadId) {
      setExpandedThreadId(thread_id);
      setcurrentThreadMessages(
        messages.filter((message) => {
          if (message.thread_id === thread_id && message.id !== messageId)
            return message;
        })
      );
    } else {
      setreplyThread(null);
      setExpandedThreadId(null);
      setcurrentThreadMessages([]);
    }
  };
  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom on new message
  useEffect(() => {
    scrollToBottom();
    buildThreadMap();
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
      message: replyThread ? replyMessage : newMessage,
      thread_id:replyThread?replyThread:null,
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
        <div className="flex justify-center items-center w-1/6 h-10 cursor-pointer">
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
      <div className="flex-1 flex flex-col gap-2 bg-white p-4 overflow-scroll">
        {messages.map((message, index) => {
          return (
            <div
              className={`message flex flex-col hover:bg-gray-100 ${
                message.is_thread_head &&
                "border border-gray-300 shadow-lg rounded-lg cursor-pointer"
              }`}
            >
              <Message
                index={index}
                message={message}
                currentUser={currentUser}
                isGroup={isGroup}
                messageActionIndex={messageActionIndex}
                setmessageActionIndex={setmessageActionIndex}
                currentThreadMessages={currentThreadMessages}
                onThreadClick={() =>
                  handleThreadClick(message.thread_id, message.id)
                }
              />

              {message.is_thread_head &&
                expandedThreadId === message.thread_id && (
                  <div className="flex flex-col ml-6 mt-2">
                    {currentThreadMessages.map((threadMessage) => (
                      <Message
                        key={threadMessage.id}
                        message={threadMessage}
                        currentUser={currentUser}
                        isGroup={isGroup}
                        expandedThreadId={expandedThreadId}
                        messageActionIndex={messageActionIndex}
                        setmessageActionIndex={setmessageActionIndex}
                      />
                    ))}
                  </div>
                )}
              {message.is_thread_head &&
                expandedThreadId === message.thread_id &&
                replyThread && (
                  <div className="border bottom-0 flex justify-evenly items-center focus:border-none focus:outline-none w-full h-18 bg-white p-4">
                    <input
                      type="text"
                      className="h-8 w-10/12 rounded-md border border-blue-400 focus:outline-none p-2"
                      value={replyMessage}
                      onChange={handleReplyChange}
                    />
                    <button
                      className="h-7 w-14 bg-blue-500 hover:bg-blue-600 rounded-md"
                      onClick={handleSend}
                    >
                      Send
                    </button>
                  </div>
                )}

              {message.is_thread_head && (
                <>
                  <div className="line w-full h-[1px] bg-gray-200 block"></div>
                  <div className="replies flex justify-between items-center px-2 bg-white w-full h-6 text-sm ">
                    <span className="text-blue-400">
                      {threadMap[message.thread_id]?.length} Replies
                    </span>
                    <section className="flex gap-2 justify-evenly">
                      <CgMailReply
                        size={17}
                        className="hover:text-blue-400 cursor-pointer"
                        onClick={() => setreplyThread(message.thread_id)}
                      />
                      <CiUser className="hover:text-blue-400 cursor-pointer" />
                    </section>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {/* Scroll to bottom reference */}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed message input */}
      <div className="sticky border bottom-0 flex justify-evenly items-center focus:border-none focus:outline-none w-full h-18 bg-white p-4">
        <input
          type="text"
          className="h-8 w-10/12 rounded-md border border-blue-400 focus:outline-none p-2"
          value={newMessage}
          onChange={handleChange}
        />
        <button
          className="h-7 w-14 bg-blue-500 hover:bg-blue-600 rounded-md"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
