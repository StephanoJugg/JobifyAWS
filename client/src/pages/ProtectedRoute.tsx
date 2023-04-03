import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { useAuthContext } from "../wrappers/AuthContext";
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuthContext();

  if (!user) return <Navigate to="/landing" />;

  return <React.Fragment>{children}</React.Fragment>;
}
