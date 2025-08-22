import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../congif";
import { setMessage } from "../redux/messageSlice";

const getMessage = () => {
  const dispatch = useDispatch();
  const { userData, selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMessage = async () => {
      if (!selectedUser?._id) return; // ✅ null check
      try {
        const result = await axios.get(
          `${serverUrl}/api/message/get/${selectedUser._id}`,
          { withCredentials: true }
        );
        dispatch(setMessage(result.data));
      } catch (error) {
        console.log("❌ Error fetching messages:", error);
      }
    };

    fetchMessage();
  }, [selectedUser, userData, dispatch]);

  return null; // ✅ kuch render nahi karna
};

export default getMessage;
