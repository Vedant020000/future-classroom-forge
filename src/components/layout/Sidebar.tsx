
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Monitor, 
  Users,
  GraduationCap,
  Settings,
  Grid3X3,
  Theater,
  PenTool,
  UserCheck,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
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
    name: "Grid Classroom",
    href: "/virtual-classroom-grid",
    icon: Grid3X3,
  },
  {
    name: "Theater Classroom",
    href: "/virtual-classroom-theater",
    icon: Theater,
  },
  {
    name: "Whiteboard Classroom",
    href: "/virtual-classroom-whiteboard",
    icon: PenTool,
  },
  {
    name: "Breakout Classroom",
    href: "/virtual-classroom-breakout",
    icon: UserCheck,
  },
  {
    name: "AI Smart Classroom",
    href: "/virtual-classroom-ai",
    icon: Brain,
  },
  {
    name: "Students",
    href: "/students",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="flex items-center gap-2 p-6 border-b border-sidebar-border">
          <GraduationCap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">TheFuture</h1>
            <p className="text-sm text-muted-foreground">Classroom</p>
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
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:text-sidebar-primary-foreground hover:bg-sidebar-accent"
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
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">
            Empowering Education with AI
          </p>
        </div>
      </div>
    </div>
  );
};
