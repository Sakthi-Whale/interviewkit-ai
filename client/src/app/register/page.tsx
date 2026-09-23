"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);

      await api.post("/auth/register", form);

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Create Account
        </h1>

        <p className="text-slate-400 mb-8">
          Join InterviewKit AI
        </p>

        <div className="space-y-5">
          <input
            placeholder="Full Name"
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-slate-800 text-white rounded-xl px-4 py-3"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>
      </div>
    </main>
  );
}