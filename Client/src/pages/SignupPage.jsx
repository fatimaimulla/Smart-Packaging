import Header from "@/common/Header";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { clearAuthError, startSignup } from "@/redux/slice/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const isSubmitting = status === "loading";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(startSignup(form));

    if (startSignup.fulfilled.match(result)) {
      toast.success("OTP sent to your email.");
      navigate("/verify-otp");
      return;
    }

    toast.error(result.payload || "Unable to start signup.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF]">
      <Header />
      <main className="pt-32 px-6 pb-16">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-white/60 p-8">
          <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">
            Sign up to save uploads, configurations, and project history.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, email: event.target.value }))
              }
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
              required
              minLength={8}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-[#0D1B2A] py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-70"
            >
              {isSubmitting ? "Sending OTP..." : "Create Account"}
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              or
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <GoogleAuthButton />

          <p className="mt-8 text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-600">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
