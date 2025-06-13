
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Monitor, TrendingUp, Clock, Star } from "lucide-react";

export const DashboardPage = () => {
  const stats = [
    {
      title: "Lesson Plans Created",
      value: "24",
      icon: BookOpen,
      change: "+12% from last month",
      trend: "up"
    },
    {
      title: "Students Managed",
      value: "156",
      icon: Users,
      change: "+3 new this week",
      trend: "up"
    },
    {
      title: "Virtual Classes",
      value: "18",
      icon: Monitor,
      change: "6 completed today",
      trend: "neutral"
    },
    {
      title: "Success Rate",
      value: "94%",
      icon: TrendingUp,
      change: "+2% improvement",
      trend: "up"
    }
  ];

  const recentPlans = [
    { title: "Introduction to Algebra", subject: "Mathematics", created: "2 days ago", status: "Active" },
    { title: "World War II History", subject: "History", created: "5 days ago", status: "Testing" },
    { title: "Chemical Reactions", subject: "Science", created: "1 week ago", status: "Completed" },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Welcome back, Teacher
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening in your classroom today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-primary mt-1">{stat.change}</p>
              </div>
              <stat.icon className="h-8 w-8 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Lesson Plans
          </h3>
          <div className="space-y-4">
            {recentPlans.map((plan, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <div>
                  <p className="font-medium text-foreground">{plan.title}</p>
                  <p className="text-sm text-muted-foreground">{plan.subject} • {plan.created}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  plan.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                  plan.status === 'Testing' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {plan.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Progress Overview */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            This Week's Progress
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Lesson Plans Completed</span>
                <span>7/10</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Virtual Classes Tested</span>
                <span>5/8</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Student Data Updated</span>
                <span>12/15</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
