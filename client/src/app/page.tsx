/*this file is the home page of the application that provides an overview of the features and benefits of using InterviewKit AI. It includes a brief description, a call-to-action to login or register, and a visually appealing layout with centered content.*/

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center max-w-2xl px-6">
        <p className="text-blue-400 font-semibold mb-3">
          AI Powered Interview Preparation
        </p>

        <h1 className="text-5xl font-bold mb-6">
          InterviewKit AI
        </h1>

        <p className="text-slate-300 mb-10">
          Generate personalized interview preparation kits using a Job Description,
          Company URL, and your available preparation days.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="border border-slate-600 hover:border-blue-500 px-6 py-3 rounded-xl font-semibold"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}