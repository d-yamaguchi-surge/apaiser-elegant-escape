import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // まず「ログインしていない」場合を最優先
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 次に「管理者ではない」場合
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            アクセス拒否
          </h1>
          <p className="text-muted-foreground">管理者権限が必要です。</p>
        </div>
      </div>
    );
  }

  // 両方OKなら内容を表示
  return <>{children}</>;
};
