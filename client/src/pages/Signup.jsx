import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../congif";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { userName, email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/profile");
      setLoading(false);
      setUserName("");
      setEmail("");
      setPassword("");
      setErr("");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErr(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg">
        {/* Top header */}
        <div className="bg-sky-500 rounded-t-xl text-center py-6">
          <h2 className="text-white text-xl md:text-2xl font-semibold">
            Signup to <span className="font-bold">chatly</span>
          </h2>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm md:text-base"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm md:text-base"
            />
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm md:text-base"
              />
              <span className="absolute right-3 top-3 text-sky-500 text-xs md:text-sm cursor-pointer">
                show
              </span>
            </div>
            {err && <p className="text-red-500 text-sm">{err}</p>}
            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm md:text-base"
            >
              {loading ? "Loading..." : "Signup"}
            </button>
          </form>

          {/* Signup link */}
          <p className="mt-4 text-center text-xs md:text-sm">
            Already have an Account?{" "}
            <a href="/login" className="text-sky-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
