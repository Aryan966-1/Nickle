import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PiggyBank, Lock, Mail } from "lucide-react";
import api from "../services/api";

const LoginPage = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

  if (location.state?.message) {
    setMessage(location.state.message);
  }

  const user = localStorage.getItem("nickle_user");

  if (user && location.pathname === "/login") {
    navigate("/dashboard", { replace: true });
  }

}, []);


  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {

      const response = await api.post("/login", {
        email: email.trim(),
        password: password
      });

      console.log("LOGIN RESPONSE:", response.data);

      const user = response.data.user;

      if (!user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("nickle_user", JSON.stringify(user));

      navigate("/dashboard");

    } catch (err: any) {

      console.error("LOGIN ERROR:", err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Invalid email or password");
      }

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">

      <div className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-2xl shadow-xl">

        <div className="text-center mb-6">
          <PiggyBank className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to Nickle
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md text-sm text-center mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-600 p-3 rounded-md text-sm text-center mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 px-3 py-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 px-3 py-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="text-right text-sm">
            <Link
              to="/forgot-password"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>

        <div className="text-center mt-6 text-sm">
          <Link
            to="/signup"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Don't have an account? Sign up
          </Link>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;