// Profile.jsx
import React, { useRef, useState } from "react";
import dp from "../assets/dp.webp";
import { FaUser, FaAt, FaCamera, FaArrowLeft } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../congif";
import { setUserData } from "../redux/userSlice";

export default function Profile() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(userData?.name || "");
  const [frontendImage, setFrontentImage] = useState(userData?.image || dp);
  const [backendImage, setBackendImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const image = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBackendImage(file);
    setFrontentImage(URL.createObjectURL(file));
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let formData = new FormData();
      formData.append("name", name);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.put(
        `${serverUrl}/api/user/profile`,
        formData,
        { withCredentials: true }
      );

      dispatch(setUserData(result.data.user));
      navigate("/");
      setSaving(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 px-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-gray-600 hover:text-blue-500 transition-colors"
      >
        <FaArrowLeft size={22} />
      </button>

      <div className="bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg lg:max-w-2xl border border-white/50 relative">
        {/* Profile Picture with Camera */}
        <div className="flex justify-center mb-6 relative">
          <img
            src={frontendImage}
            alt="Profile"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <div
            onClick={() => image.current.click()}
            className="absolute bottom-2 right-[40%] sm:right-[42%] md:right-[44%] bg-blue-500 p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-600 transition"
          >
            <FaCamera className="text-white text-sm" />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={image}
            hidden
            onChange={handleImage}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleProfile} className="space-y-4">
          {/* Name */}
          <div className="flex items-center border border-gray-200 rounded-xl shadow-sm focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all duration-300">
            <FaUser className="text-gray-500 ml-3" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Full Name"
              className="w-full p-3 rounded-xl outline-none bg-transparent"
            />
          </div>

          {/* Username (read-only) */}
          <div className="flex items-center border border-gray-200 rounded-xl shadow-sm bg-gray-50">
            <FaAt className="text-gray-500 ml-3" />
            <input
              value={userData?.user.userName || ""}
              type="text"
              readOnly
              className="w-full p-3 rounded-xl outline-none bg-transparent cursor-not-allowed"
            />
          </div>

          {/* Email (read-only) */}
          <div className="flex items-center border border-gray-200 rounded-xl shadow-sm bg-gray-50">
            <MdEmail className="text-gray-500 ml-3" />
            <input
              value={userData?.user.email || ""}
              type="email"
              readOnly
              className="w-full p-3 rounded-xl outline-none bg-transparent cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <button
            disabled={saving}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
