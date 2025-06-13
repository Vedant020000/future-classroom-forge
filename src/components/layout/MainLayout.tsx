
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const MainLayout = () => {
  const location = useLocation();
  const isVirtualClassroom = location.pathname === '/virtual-classroom';

  // Virtual classroom uses its own layout
  if (isVirtualClassroom) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-black text-foreground flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
