import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicOnlyRoute = () => {
  const { bootstrapped, user } = useSelector((state) => state.auth);

  if (!bootstrapped) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4FA]">
        <p className="text-gray-500 text-sm font-medium">Loading your account...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/projects" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
