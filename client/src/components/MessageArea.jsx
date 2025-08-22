import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import EmojiPicker from "emoji-picker-react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { serverUrl } from "../congif";
import { setMessage } from "../redux/messageSlice";

const MessageArea = () => {
  const { selectedUser, userData, socket } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [input, setInput] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const image = useRef();
  let { messages } = useSelector((state) => state.message);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input && !backendImage) return;
    try {
      let formData = new FormData();
      formData.append("message", input);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMessage([...messages, result.data]));
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log("❌ Error sending message:", error);
    }
  };

  const onEmojiClick = (emojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowPicker(false);
  };

  useEffect(() => {
    socket.on("newMessage", (mess) => {
      dispatch(setMessage([...messages, mess]));
    });
    return () => socket.off("newMessage");
  }, [messages, setMessage]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 flex flex-col">
      {selectedUser ? (
        <>
          {/* Header */}
          <div className="relative w-full h-14 sm:h-16 md:h-20 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-md flex items-center px-3 sm:px-5">
            <button
              onClick={() => dispatch(setSelectedUser(null))}
              className="absolute left-3 sm:left-4 text-white hover:text-gray-200 transition"
            >
              <FaArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>

            <div className="ml-10 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img
                src={selectedUser?.image || dp}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="ml-3 sm:ml-4">
              <h1 className="text-sm sm:text-base md:text-lg font-semibold text-white truncate max-w-[120px] sm:max-w-[180px] md:max-w-[250px] lg:max-w-md">
                {selectedUser?.name || "User"}
              </h1>
              <span className="text-xs sm:text-sm text-gray-200">Online</span>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-5 flex flex-col gap-2">
            {messages?.length === 0 ? (
              <div className="flex justify-center mt-6 sm:mt-10">
                <p className="text-gray-500 italic text-xs sm:text-sm md:text-base text-center">
                  Start a conversation with {selectedUser?.name || "user"} 💬
                </p>
              </div>
            ) : (
              messages.map((mess, index) => (
                <div
                  key={index}
                  className={`flex ${
                    mess.sender === userData.user._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {mess.sender === userData.user._id ? (
                    <SenderMessage image={mess.image} message={mess.message} />
                  ) : (
                    <ReceiverMessage
                      image={mess.image}
                      message={mess.message}
                    />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Image Preview */}
          {frontendImage && (
            <div className="w-full px-3 sm:px-4 py-2 bg-white border-t border-gray-300 flex justify-start">
              <div className="relative">
                <img
                  src={frontendImage}
                  alt="preview"
                  className="max-w-[90px] sm:max-w-[130px] md:max-w-[150px] lg:max-w-[200px] max-h-[80px] sm:max-h-[110px] md:max-h-[120px] lg:max-h-[150px] rounded-lg shadow-md border"
                />
                <button
                  type="button"
                  onClick={() => setFrontendImage(null)}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full shadow"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="relative">
            <form onSubmit={handleSendMessage}>
              <div className="w-full p-2 sm:p-3 md:p-4 bg-white shadow-inner flex items-center gap-2 sm:gap-3 md:gap-4">
                {/* Emoji */}
                <div className="relative flex items-center">
                  <button
                    onClick={() => setShowPicker((prev) => !prev)}
                    type="button"
                    className="text-gray-500 hover:text-yellow-500 transition"
                  >
                    <BsEmojiSmile className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </button>

                  {showPicker && (
                    <div className="absolute bottom-12 sm:bottom-14 left-0 z-50 shadow-lg rounded-lg cursor-pointer">
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        width={220}
                        height={300}
                      />
                    </div>
                  )}
                </div>

                {/* Camera */}
                <button
                  type="button"
                  onClick={() => image.current.click()}
                  className="text-gray-500 hover:text-blue-500 transition"
                >
                  <FaCamera className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
                <input
                  onChange={handleImage}
                  type="file"
                  accept="image/*"
                  ref={image}
                  hidden
                />

                {/* Message Input */}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base rounded-full border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
                />

                {/* Send */}
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-3 sm:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base rounded-full hover:bg-blue-600 transition"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 p-4 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-2">
            Welcome to Chatly 👋
          </h1>
          <span className="text-gray-500 text-xs sm:text-sm md:text-base">
            Select a user to start chatting
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageArea;
