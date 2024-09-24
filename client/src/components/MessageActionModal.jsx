import React, { useState, useRef, useEffect } from "react";
import { CgMailForward } from "react-icons/cg";
import { TfiMore } from "react-icons/tfi";

const MessageActionModal = () => {
  const [moreActions, setMoreActions] = useState(false);
  const [isAbove, setIsAbove] = useState(false);
  const parentRef = useRef(null);

  useEffect(() => {
    if (parentRef.current) {
      const parentPosition = parentRef.current.getBoundingClientRect();
      const screenHeight = window.innerHeight;
      const middleScreen = screenHeight / 2;

      if (parentPosition.top < middleScreen) {
        setIsAbove(false);
      } else {
        setIsAbove(true);
      }
    }
  }, [moreActions]);

  return (
    <>
      <div
        ref={parentRef}
        style={{ backgroundColor: "inherit" }}
        className="actions absolute flex items-center bg-gray-200 shadow-lg bottom-[90%] left-10 w-auto h-6"
      >
        <div className="reaction"></div>
        <div className="w-[1px] bg-gray-400 h-4/6 rounded-sm"></div>
        <div className="forward cursor-pointer">
          <CgMailForward />
        </div>
        <div
          className="more cursor-pointer"
          onClick={() => setMoreActions((prev) => !prev)}
        >
          <TfiMore />
        </div>
      </div>
      {moreActions && (
        <div
          className={`moreactions absolute ${setIsAbove?'bottom-0':'bottom-24'}bottom-24 w-32 bg-gray-200`}
        >
          Moreactions
        </div>
      )}
    </>
  );
};

export default MessageActionModal;
