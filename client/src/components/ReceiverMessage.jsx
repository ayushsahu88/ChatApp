import React, { useEffect, useRef } from "react";

const ReceiverMessage = ({ image, message }) => {
  const scroll = useRef();

  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);
  return (
    <div className="flex justify-start px-3 mb-3">
      <div
        className="relative group bg-gray-200 text-gray-800 max-w-[100%] px-4 py-3 rounded-2xl rounded-bl-none shadow-lg shadow-gray-400/40 transition-transform duration-200 hover:scale-[1.01]"
        ref={scroll}
      >
        {/* Bubble Tail */}
        <span className="absolute -bottom-1 left-4 w-3 h-3 bg-gray-200 rotate-45"></span>

        {/* Image */}
        {image && (
          <div className="mb-2 overflow-hidden rounded-xl">
            <img
              src={image}
              alt="received"
              className="w-52 h-auto object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 shadow-md"
            />
          </div>
        )}

        {/* Message */}
        {message && (
          <span className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
            {message}
          </span>
        )}
      </div>
    </div>
  );
};

export default ReceiverMessage;
