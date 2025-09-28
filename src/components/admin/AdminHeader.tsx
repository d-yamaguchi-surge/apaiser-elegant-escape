import { useAuth } from '@/hooks/useAuth';

export const AdminHeader = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card">
      <div className="h-full px-6 flex items-center justify-between">
        <div />
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {user?.email}
          </div>
        </div>
      </div>
    </header>
  );
};