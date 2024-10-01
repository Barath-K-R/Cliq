import React, { useState, useRef, useEffect } from "react";
import { CgMailForward } from "react-icons/cg";
import { TfiMore } from "react-icons/tfi";

const MessageActionModal = () => {
  const [moreActions, setMoreActions] = useState(false);
  const [position, setPosition] = useState("");
  const parentRef = useRef(null);

  useEffect(() => {
    if (parentRef.current) {
      const parentPosition = parentRef.current.getBoundingClientRect();
      const screenHeight = window.innerHeight;
      const middleScreen = screenHeight / 2;

      if (parentPosition.top < middleScreen / 2) {
        console.log("below");
        setPosition("below");
      } else if (parentPosition.top < middleScreen) {
        console.log("middle");
        setPosition("middle");
      } else {
        console.log("above");
        setPosition("above");
      }
    }
  }, [moreActions]);

  return (
    <>
      <div
        ref={parentRef}
        className="actions absolute flex items-center justify-around gap-2 bg-white shadow-lg bottom-[90%] left-[70%] w-auto h-6 z-10"
      >
        <div className="reaction"></div>
        <div className="w-[1px] bg-gray-400 h-4/6 rounded-sm"></div>
        <div className="forward flex items-center justify-center w-6 h-full hover:bg-blue-100 hover:text-blue-400 cursor-pointer">
          <CgMailForward />
        </div>
        <div
          className="more flex items-center justify-center w-6 h-full hover:bg-blue-100 hover:text-blue-400 cursor-pointer"
          onClick={() => setMoreActions((prev) => !prev)}
        >
          <TfiMore />
        </div>
      </div>
      {moreActions && (
        <div
          className={`moreactions absolute w-32 bg-white shadow-lg ${
            position === "below"
              ? "top-0 mt-2"
              : position === "middle"
              ? "top-1/2 transform -translate-y-1/2"
              : "bottom-full mb-2"
          } left-[70%] z-20`}
        >
          <section className="m-2">
            <div className="forward hover:bg-blue-100 cursor-pointer hover:text-blue-400 rounded-sm">
              <span className="p-2">Forward</span>
            </div>
            <div className="copylink hover:bg-blue-100 hover:text-blue-400 rounded-sm cursor-pointer">
              <span className="p-2">Copy Link</span>
            </div>
            <div className="pin hover:bg-blue-100 hover:text-blue-400 rounded-sm cursor-pointer">
              <span className="p-2">Pin</span>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default MessageActionModal;
