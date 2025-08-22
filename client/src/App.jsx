import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import getCurrentUser from "./customHooks/getCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import getOtherUsers from "./customHooks/getOtherUsers";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { serverUrl } from "./congif";
import { setOnlineUsers, setSocket } from "./redux/userSlice";

const App = () => {
  getCurrentUser();
  getOtherUsers();
  const { userData, socket, onlineUsers } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      const socketio = io(`${serverUrl}`, {
        query: {
          userId: userData?.user?._id,
        },
      });
      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      return () => {
        socketio.close();
      };
    } else {
      if (socket) {
        socket.close(dispatch(setSocket(null)));
      }
    }
  }, [userData]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/signup"
            element={!userData ? <Signup /> : <Navigate to={"/profile"} />}
          />
          <Route
            path="/login"
            element={!userData ? <Login /> : <Navigate to={"/"} />}
          />
          <Route
            path="/"
            element={userData ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/profile"
            element={userData ? <Profile /> : <Navigate to={"/signup"} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
