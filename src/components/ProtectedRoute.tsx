import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/my-stay" replace />;

  return <>{children}</>;
}
