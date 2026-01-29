import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAppContext } from "../context/AppContext";   // ✅ add this

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAppContext();                    // ✅ get setUser from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Continue clicked");

    try {
      const url =
        mode === "signup"
          ? `${backendUrl}/api/user/register`
          : `${backendUrl}/api/user/login`;

      const payload =
        mode === "signup"
          ? { name, phone, email, password }
          : { email, password };

      const res = await axios.post(url, payload);

      if (res.data.success) {
        // ✅ create a simple user object to store
        const userData =
          mode === "signup"
            ? { name, phone, email }
            : { email }; // you can later expand this if backend returns more info

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(userData)); // ✅ persist
        setUser(userData);                                     // ✅ update context right away

        toast.success("Login successful");
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="relative z-50 w-[420px] rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close */}
        <button
          onClick={() => navigate("/")}
          className="absolute right-5 top-5 text-gray-400 hover:text-primary cursor-pointer"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-black">
          {mode === "login"
            ? "Sign in to Elite Cinema"
            : "Create your Elite Cinema account"}
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Book your movie tickets faster
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <input
                type="tel"
                placeholder="Phone (10 digits)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-black py-3 text-white font-medium hover:opacity-90 cursor-pointer"
          >
            {mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Switch */}
        <p className="mt-5 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setMode("signup")}
                className="cursor-pointer font-medium text-black"
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setMode("login")}
                className="cursor-pointer font-medium text-black"
              >
                Sign in
              </span>
            </>
          )}
        </p>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Secured by Elite Cinema
        </p>
      </div>
    </div>
  );
};

export default Auth;
