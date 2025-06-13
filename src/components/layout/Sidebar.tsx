
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Monitor, 
  Users,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Lesson Plans",
    href: "/lesson-plans",
    icon: BookOpen,
  },
  {
    name: "Create Lesson Plan",
    href: "/create-lesson-plan",
    icon: PlusCircle,
  },
  {
    name: "Virtual Classroom",
    href: "/virtual-classroom",
    icon: Monitor,
  },
  {
    name: "Students",
    href: "/students",
    icon: Users,
  },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center gap-2 p-6 border-b border-gray-700">
          <GraduationCap className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-lg font-bold text-white">TheFuture</h1>
            <p className="text-sm text-gray-400">Classroom</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            Empowering Education with AI
          </p>
        </div>
      </div>
    </div>
  );
};
