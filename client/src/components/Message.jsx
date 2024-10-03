import React, { useState } from "react";
import MessageActionModal from "./MessageActionModal.jsx";
import { FiEye } from "react-icons/fi";
const Message = ({
  index,
  currentUser,
  isGroup,
  setmessageActionIndex,
  messageActionIndex,
  message,
  onThreadClick,
  currentThreadMessages,
}) => {
  const [expandedThreadId, setExpandedThreadId] = useState(null);

  const isCurrentUser = message.sender_id === currentUser.id;

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

  const handleThreadClick = () => {
    if (message.is_thread_head && onThreadClick) {
      console.log(message.thread_id);
      onThreadClick(message.thread_id, message.id);
    }
  };

  return (
    <>
      {(message.is_thread_head || message.thread_id === null) && (
        <div
          key={index}
          className={`parent flex-col relative inline-block max-w-max p-2  rounded-lg ${
            isCurrentUser ? " self-end" : "self-start"
          }`}
          onMouseOver={() => setmessageActionIndex(index)}
          onMouseLeave={() => setmessageActionIndex(null)}
          onClick={handleThreadClick}
        >
          {messageActionIndex === index && <MessageActionModal />}

          <span className="font-bold">
            {isGroup &&
              message.sender_id !== currentUser.id ?
              message?.User?.username:'you'}
          </span>
          <section>
            <p className="text-base">{message.message}</p>
            {/* timing */}
            <span className="text-xs">
              {convertDateTime(message?.createdAt)}
            </span>
            {/* seen or unseen */}
            {message?.ReadReciepts?.length === 1 &&
              message.ReadReciepts[0].seen_at &&
              message.sender_id === currentUser.id && <FiEye size={10} />}
          </section>
          
          {/* replies */}
          {/* {message.is_thread_head && (
            <div
              className='replies w-full h-4 text-sm text-blue-400'
            >
              {currentThreadMessages.length} Replies
            </div>
          )} */}
        </div>
      )}
    </>
  );
};

export default Message;
