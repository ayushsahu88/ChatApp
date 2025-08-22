import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dp from "../assets/dp.webp";
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import axios from "axios";
import { serverUrl } from "../congif";
import {
  setOtherUsers,
  setUserData,
  setSelectedUser,
  setSearchData,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
  const { userData, otherUsers, searchData } = useSelector(
    (state) => state.user
  );
  const [search, setSearch] = useState(false);
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      dispatch(setOtherUsers(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?query=${input}`,
        { withCredentials: true }
      );
      if (result.data.success) {
        dispatch(setSearchData(result.data.users));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (input) handleSearch();
    }, 500);
    return () => clearTimeout(timeout);
  }, [input]);

  return (
    <div
      className="
        relative 
        w-full 
        md:w-[35%] 
        lg:w-[280px] 
        xl:w-[320px] 
        h-screen 
        bg-gradient-to-b from-blue-100 via-blue-50 to-white 
        shadow-md border-r border-gray-200 
        flex flex-col
      "
    >
      {/* Header */}
      <div className="w-full h-[220px] sm:h-[240px] lg:h-[260px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-b-3xl shadow-md flex flex-col items-center justify-start pt-8 sm:pt-10 text-white relative">
        {/* Logo */}
        <h1 className="absolute top-3 left-4 sm:top-4 sm:left-5 text-lg sm:text-xl font-bold tracking-wide drop-shadow-md">
          Chatly
        </h1>

        {/* Profile Image */}
        <div
          onClick={() => navigate("/profile")}
          className="w-[70px] h-[70px] sm:w-[85px] sm:h-[85px] rounded-full overflow-hidden flex justify-center items-center shadow-lg border-4 border-white cursor-pointer"
        >
          <img
            src={userData?.user?.image || dp}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Greeting */}
        <h1 className="mt-2 sm:mt-3 text-sm sm:text-base font-medium drop-shadow-sm">
          Hi, {userData?.user?.name || "user"}
        </h1>

        {/* Search Section */}
        <div className="mt-4 sm:mt-5 w-[85%] sm:w-[80%] relative">
          {!search && (
            <button
              onClick={() => setSearch(true)}
              className="w-full flex items-center justify-center gap-2 bg-white/30 px-3 sm:px-4 py-2 rounded-full cursor-pointer hover:bg-white/50 transition"
            >
              <IoIosSearch className="text-white text-sm sm:text-base" />
              <span className="text-white text-xs sm:text-sm">Search</span>
            </button>
          )}

          {search && (
            <div className="flex flex-col relative">
              <form className="flex items-center gap-2 bg-white rounded-full px-2 sm:px-3 py-2 shadow-md">
                <IoIosSearch className="text-gray-500 text-sm sm:text-base" />
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  type="text"
                  placeholder="Search users..."
                  className="flex-1 outline-none text-xs sm:text-sm bg-transparent text-gray-800 placeholder-gray-400"
                />
                <RxCross2
                  onClick={() => {
                    setSearch(false);
                    setInput("");
                  }}
                  className="text-gray-600 text-sm sm:text-base cursor-pointer hover:text-red-500 transition"
                />
              </form>

              {/* Search results dropdown */}
              {searchData && searchData.length > 0 && (
                <div className="absolute top-[42px] sm:top-[48px] left-0 w-full bg-white shadow-md rounded-md max-h-52 sm:max-h-60 overflow-y-auto z-10">
                  {searchData.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => {
                        dispatch(setSelectedUser(user));
                        setSearch(false);
                        setInput("");
                      }}
                      className="flex items-center gap-2 sm:gap-3 p-2 hover:bg-blue-100 cursor-pointer transition"
                    >
                      <img
                        src={user.image || dp}
                        alt={user.name}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-700 text-sm sm:text-base">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Body */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <h2 className="text-gray-600 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
          Chats
        </h2>

        {(input && searchData && searchData.length > 0
          ? searchData
          : otherUsers
        )?.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {(input && searchData && searchData.length > 0
              ? searchData
              : otherUsers
            ).map((user, idx) => (
              <div
                onClick={() => {
                  dispatch(setSelectedUser(user));
                  setInput("");
                  setSearch(false);
                }}
                key={idx}
                className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-blue-100 cursor-pointer transition"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border shadow">
                  <img
                    src={user.image || dp}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm sm:text-base">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-xs sm:text-sm">
            No chats available. Start searching users 🔍
          </p>
        )}
      </div>

      {/* Logout Button */}
      <button
        className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 bg-red-500 hover:bg-red-600 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300"
        onClick={handleLogOut}
      >
        <BiLogOutCircle size={20} className="sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

export default SideBar;
