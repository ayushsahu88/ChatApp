import axios from "axios";
import React, { useEffect } from "react";
import { serverUrl } from "../congif";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const getCurrentUser = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);
};

export default getCurrentUser;
