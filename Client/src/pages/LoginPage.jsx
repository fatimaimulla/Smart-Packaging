import Header from "@/common/Header";
import { clearAuthError, loginUser } from "@/redux/slice/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const isSubmitting = status === "loading";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back.");
      navigate(location.state?.from?.pathname || "/projects", { replace: true });
      return;
    }

    toast.error(result.payload || "Unable to log in.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF]">
      <Header />
      <main className="pt-32 px-6 pb-16">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-white/60 p-8">
          <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">Log In</h1>
          <p className="text-gray-500 mb-8">
            Continue to your SmartPack projects and saved packaging history.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-[#0D1B2A] py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-70"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
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
            New here?{" "}
            <Link to="/signup" className="font-semibold text-blue-600">
              Create your account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
