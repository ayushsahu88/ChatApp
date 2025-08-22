import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../congif";
import { setOtherUsers } from "../redux/userSlice";

const getOtherUsers = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/others`, {
          withCredentials: true,
        });
        console.log(result);
        dispatch(setOtherUsers(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [userData]);
};

export default getOtherUsers;
