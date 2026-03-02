import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../api/authApi";
import { useAuth } from "../store/auth";

export default function Register() {
  const nav = useNavigate();
  const { saveAuth } = useAuth();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await registerApi(form);

      if (!res?.token) {
        setErr(res?.message || "Register failed");
        return;
      }

      saveAuth(res);
      nav("/dashboard");
    } catch (e2) {
      setErr(e2?.message || "Register error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100svh] bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-xl">
        <h1 className="text-xl sm:text-2xl font-bold">Register</h1>

        {err && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-3">
          <input
            className="w-full h-11 sm:h-12 px-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-purple-500 text-sm sm:text-base"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={onChange}
            autoComplete="username"
          />

          <input
            className="w-full h-11 sm:h-12 px-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-purple-500 text-sm sm:text-base"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            autoComplete="email"
          />

          <input
            className="w-full h-11 sm:h-12 px-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-purple-500 text-sm sm:text-base"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            autoComplete="new-password"
          />

          <button
            disabled={loading}
            className="w-full h-11 sm:h-12 rounded-xl bg-purple-700 hover:bg-purple-600 font-semibold disabled:opacity-60 text-sm sm:text-base"
          >
            {loading ? "Please wait..." : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-300 text-center">
          Already have an account?{" "}
          <Link className="text-blue-400 underline" to="/">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}