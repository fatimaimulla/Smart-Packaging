import Header from "@/common/Header";
import {
  clearAuthError,
  verifySignup,
} from "@/redux/slice/authSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerifyOtpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingSignupEmail, status, error } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!pendingSignupEmail) {
      navigate("/signup", { replace: true });
    }
  }, [navigate, pendingSignupEmail]);

  const isSubmitting = status === "loading";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      verifySignup({ email: pendingSignupEmail, otp }),
    );

    if (verifySignup.fulfilled.match(result)) {
      toast.success("Account verified.");
      navigate("/projects", { replace: true });
      return;
    }

    toast.error(result.payload || "Unable to verify OTP.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8FFF4] via-[#F5FBFF] to-[#CDE7FF]">
      <Header />
      <main className="pt-32 px-6 pb-16">
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-white/60 p-8">
          <h1 className="text-3xl font-bold text-[#0D1B2A] mb-2">Verify OTP</h1>
          <p className="text-gray-500 mb-6">
            Enter the verification code sent to{" "}
            <span className="font-semibold text-[#0D1B2A]">{pendingSignupEmail}</span>.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="6-digit OTP"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-center text-2xl tracking-[0.35em] outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-[#0D1B2A] py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-70"
            >
              {isSubmitting ? "Verifying..." : "Verify Account"}
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <p className="mt-8 text-sm text-gray-500">
            Need to restart?{" "}
            <Link to="/signup" className="font-semibold text-blue-600">
              Create account again
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default VerifyOtpPage;
