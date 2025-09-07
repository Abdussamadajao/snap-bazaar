import { authClient } from "@/lib/auth-client";
import { PATH_AUTH } from "@/routes/paths";
import { useAuthStore } from "@/store/auth";
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, error, isPending } = authClient.useSession();

  const { setAuth, logout, isAuthenticated } = useAuthStore();

  function onLogOut() {
    toast.error("Session expired, please login again");
    logout();
    navigate(PATH_AUTH.login);
  }

  useEffect(() => {
    // Don't do anything while loading
    if (isPending) return;

    // Handle successful authentication
    if (data) {
      setAuth({ user: data.user as unknown as any, session: data.session });
      return;
    }

    // Handle errors
    if (error) {
      console.error("Session error:", error);
      onLogOut();
      return;
    }

    // Handle no data after loading is complete
    console.log("No session data available, logging out");
    onLogOut();
  }, [isPending, data, error, setAuth]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authenticating...
          </h1>
          <p className="text-gray-600">
            Please wait while we verify your session
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
