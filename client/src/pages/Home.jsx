import React from "react";
import { useSelector } from "react-redux";
import SideBar from "../components/SideBar";
import MessageArea from "../components/MessageArea";
import getMessage from "../customHooks/getMessage";

const Home = () => {
  getMessage();
  const { selectedUser } = useSelector((state) => state.user);

  return (
    <div className="w-full h-screen flex">
      {/* Mobile View (stacked / conditional) */}
      <div className="flex w-full md:hidden">
        {!selectedUser ? (
          <div className="w-full">
            <SideBar />
          </div>
        ) : (
          <div className="w-full">
            <MessageArea />
          </div>
        )}
      </div>

      {/* Desktop / Tablet View (side by side) */}
      <div className="hidden md:flex w-full h-full">
        <div className="w-1/3 lg:w-1/4 border-r">
          <SideBar />
        </div>
        <div className="flex-1">
          <MessageArea />
        </div>
      </div>
    </div>
  );
};

export default Home;
