import React, { useEffect, useRef } from "react";

const SenderMessage = ({ image, message }) => {
  const scroll = useRef();
  useEffect(() => {
    scroll?.current.scrollIntoView({ behavior: "smooth" });
  }, [message, image]);

  return (
    <div className="flex justify-end px-3 mb-3">
      <div
        className="bg-gradient-to-r from-sky-500 to-sky-600 text-white max-w-[100%] px-4 py-2 rounded-2xl rounded-br-none shadow-lg shadow-sky-400/40 transition-transform duration-200 hover:scale-[1.01]"
        ref={scroll}
      >
        {/* Image */}
        {image && (
          <div className="mb-2">
            <img
              src={image}
              alt="sent"
              className="w-48 h-auto rounded-xl object-cover shadow-md shadow-sky-300/40"
            />
          </div>
        )}

        {/* Message */}
        {message && (
          <span className="text-[15px] leading-relaxed break-words whitespace-pre-wrap drop-shadow-sm">
            {message}
          </span>
        )}
      </div>
    </div>
  );
};

export default SenderMessage;
