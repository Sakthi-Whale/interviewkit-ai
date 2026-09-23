/*this file is a page that displays the login form for the user to sign in. It checks if the user is already logged in by checking the token in local storage and redirects to the dashboard if so. It also handles the login process by sending a request to the server with the email and password and storing the token in local storage upon successful login.*/

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome Back
        </h1>

        <p className="text-slate-400 mb-8">
          Sign in to continue to InterviewKit AI
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-blue-400 hover:text-blue-300"
          >
            Register
          </button>
        </p>
      </div>
    </main>
  );
}