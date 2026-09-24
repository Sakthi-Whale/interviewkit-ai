"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface Kit {
  _id: string;
  companyUrl: string;
  preparationDays: number;
  status: string;
  createdAt: string;
}

interface ResumeProfile {
  skills: string[];
  projects: string[];
  experienceLevel: string;
  education: string[];
}

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  const [jobDescription, setJobDescription] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [preparationDays, setPreparationDays] = useState(7);

  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState(false);

  const [resume, setResume] = useState<ResumeProfile | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchKits = async () => {
    try {
      const res = await api.get("/kits");
      setKits(res.data.kits);
    } catch (err: any) {
      if (err.response?.status !== 401) console.error(err);
    }
  };

  const fetchResume = async () => {
    try {
      const res = await api.get("/resume/me");

      if (res.data.profile?.skills?.length) {
        setResume(res.data.profile);
      }
    } catch {
      setResume(null);
    }
  };

  // Protect dashboard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  // Load data after authentication
  useEffect(() => {
    if (user) {
      fetchKits();
      fetchResume();
    }
  }, [user]);

  const handleResumeUpload = async () => {
    if (!resumeFile) return alert("Please select a resume PDF");

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      setUploading(true);

      const res = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResume(res.data.profile);
      setResumeFile(null);

      alert("Resume saved successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateKit = async () => {
    if (!resume) {
      return alert("Please upload your resume first.");
    }

    if (!jobDescription || !companyUrl) {
      return alert("Please fill all fields.");
    }

    try {
      setLoading(true);

      await api.post("/kits", {
        jobDescription,
        companyUrl,
        preparationDays,
      });

      setJobDescription("");
      setCompanyUrl("");
      setPreparationDays(7);

      fetchKits();

      alert("Interview Kit Created!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading session...
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">InterviewKit AI</h1>
            <p className="text-slate-400 mt-1">
              Welcome back, {user.name}
            </p>
          </div>

          <button
            onClick={async () => {
              await logout();
              router.replace("/login");
            }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Resume Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          {!resume ? (
            <>
              <h2 className="text-xl font-semibold mb-2">
                Upload Resume
              </h2>

              <p className="text-slate-400 mb-5">
                Upload once. Every Interview Kit will automatically use your resume.
              </p>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setResumeFile(e.target.files?.[0] || null)
                }
                className="block w-full mb-4"
              />

              {resumeFile && (
                <p className="text-sm text-slate-400 mb-4">
                  {resumeFile.name}
                </p>
              )}

              <button
                onClick={handleResumeUpload}
                disabled={uploading || !resumeFile}
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Resume"}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center text-xl">
                  ✓
                </div>

                <div>
                  <h2 className="text-xl font-bold text-emerald-400">
                    Resume Ready
                  </h2>

                  <p className="text-slate-400 text-sm">
                    {resume.experienceLevel} • {resume.skills.length} skills extracted
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {resume.skills.slice(0, 8).map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-600 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}

                {resume.skills.length > 8 && (
                  <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">
                    +{resume.skills.length - 8} more
                  </span>
                )}
              </div>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setResumeFile(e.target.files?.[0] || null)
                }
                className="block w-full mb-4"
              />

              <button
                onClick={handleResumeUpload}
                disabled={uploading || !resumeFile}
                className="w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {uploading ? "Replacing..." : "Replace Resume"}
              </button>
            </>
          )}
        </div>

        {/* Create Kit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">
            New Interview Kit
          </h2>

          <textarea
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the complete Job Description..."
            className="w-full rounded-xl bg-slate-800 p-4 mb-4 outline-none border border-slate-700"
          />

          <input
            type="url"
            value={companyUrl}
            onChange={(e) => setCompanyUrl(e.target.value)}
            placeholder="https://company.com"
            className="w-full rounded-xl bg-slate-800 p-4 mb-5 outline-none border border-slate-700"
          />

          <div className="mb-5">
            <label className="text-sm text-slate-300">
              Preparation Days: {preparationDays}
            </label>

            <input
              type="range"
              min={1}
              max={30}
              value={preparationDays}
              onChange={(e) =>
                setPreparationDays(Number(e.target.value))
              }
              className="w-full mt-2"
            />
          </div>

          <button
            onClick={handleCreateKit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Creating..." : "Generate Interview Kit"}
          </button>
        </div>

        {/* My Kits */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-5">
            My Interview Kits
          </h2>

          {kits.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-400">
              No interview kits created yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {kits.map((kit) => (
                <Link
                  key={kit._id}
                  href={`/dashboard/${kit._id}`}
                  className="block bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">
                        {kit.companyUrl}
                      </p>

                      <p className="text-slate-400 text-sm mt-1">
                        {kit.preparationDays} Days Preparation
                      </p>
                    </div>

                    <span className="bg-yellow-600 px-3 py-1 rounded-full text-sm">
                      {kit.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <p className="text-xs text-slate-500">
                      {new Date(kit.createdAt).toLocaleDateString()}
                    </p>

                    <span className="text-blue-400 text-sm">
                      Open →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}