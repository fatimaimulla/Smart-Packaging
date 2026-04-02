import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { loginWithGoogle } from "@/redux/slice/authSlice";

const GoogleAuthButton = () => {
  const dispatch = useDispatch();

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const result = await dispatch(
            loginWithGoogle({ credential: credentialResponse.credential }),
          );

          if (loginWithGoogle.fulfilled.match(result)) {
            toast.success("Signed in with Google.");
          } else {
            toast.error(result.payload || "Google sign-in failed.");
          }
        }}
        onError={() => {
          toast.error("Google sign-in failed.");
        }}
        width="320"
        text="continue_with"
      />
    </div>
  );
};

export default GoogleAuthButton;
