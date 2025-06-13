
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
