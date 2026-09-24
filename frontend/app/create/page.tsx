"use client";

import { API_URL } from "../../lib/api";
import { FormEvent, useState } from "react";

export default function CreateKit() {
  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [days, setDays] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (!jd.trim()) {
      setError("Please enter the job description.");
      return;
    }

    if (!companyUrl.trim()) {
      setError("Please enter the company website.");
      return;
    }

    if (days < 1 || days > 60) {
      setError("Preparation days must be between 1 and 60.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await fetch(
        "${API_URL}/api/kits",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jd,
            company_url: companyUrl,
            days,
            company,
            location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate interview kit"
        );
      }

      window.location.href = `/kits/${data.kitId}`;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold">
              AI
            </div>

            <div className="text-left">
              <p className="font-bold">InterviewPrep</p>
              <p className="text-xs text-slate-400">
                AI-powered preparation
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      {/* PAGE */}
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* HERO */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-slate-900 p-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative">
            <div className="mb-4 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
              ✨ AI-powered preparation
            </div>

            <h1 className="text-4xl font-bold tracking-tight">
              Create your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Interview Kit
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-slate-300">
              Paste a job description and company website. Our AI will
              analyze the role and build a personalized interview
              preparation plan.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* JOB DETAILS */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  💼
                </div>

                <div>
                  <h2 className="font-bold">
                    Job Details
                  </h2>

                  <p className="text-sm text-slate-400">
                    Tell us about the role you're applying for.
                  </p>
                </div>
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Job Description <span className="text-blue-400">*</span>
            </label>

            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder={`Paste the complete job description here...

Example:
Frontend Developer
Requirements:
- React.js
- JavaScript
- TypeScript
- SQL
- Git

Responsibilities:
- Build responsive web applications
- Develop reusable components
- Work with APIs`}
              rows={12}
              className="w-full resize-y rounded-xl border border-white/10 bg-slate-900/70 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              required
            />

            <p className="mt-2 text-xs text-slate-500">
              {jd.length} characters
            </p>
          </section>

          {/* COMPANY */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                🏢
              </div>

              <div>
                <h2 className="font-bold">
                  Company Information
                </h2>

                <p className="text-sm text-slate-400">
                  Help the AI understand the company.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Company Name
                </label>

                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Example: Microsoft"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Location
                </label>

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Hyderabad / Remote"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Company Website <span className="text-blue-400">*</span>
              </label>

              <input
                type="url"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />

              <p className="mt-2 text-xs text-slate-500">
                We'll research the public company website for relevant
                information.
              </p>
            </div>
          </section>

          {/* PREPARATION */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                📅
              </div>

              <div>
                <h2 className="font-bold">
                  Preparation Plan
                </h2>

                <p className="text-sm text-slate-400">
                  Choose how much time you have before the interview.
                </p>
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Preparation Days
            </label>

            <div className="flex items-center gap-4">
              <input
                type="number"
                min={1}
                max={60}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-40 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:border-blue-500"
              />

              <span className="text-sm text-slate-400">
                days available
              </span>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {[1, 3, 5, 7].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDays(value)}
                  className={`rounded-lg border px-3 py-2 text-sm transition ${
                    days === value
                      ? "border-blue-500 bg-blue-500/10 text-blue-300"
                      : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {value} day{value > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </section>

          {/* ERROR */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              ⚠️ {error}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-4 text-base font-bold shadow-xl shadow-blue-500/20 transition hover:scale-[1.01] hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                AI is building your interview kit...
              </span>
            ) : (
              "✨ Generate Interview Kit"
            )}
          </button>

          <p className="text-center text-xs text-slate-600">
            The AI will analyze your role, research the company,
            generate questions and create your study schedule.
          </p>
        </form>
      </div>
    </main>
  );
}
