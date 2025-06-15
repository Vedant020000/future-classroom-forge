
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Monitor, TrendingUp, Clock, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLessonPlans } from "@/hooks/useLessonPlans";
import { useStudents } from "@/hooks/useStudents";

export const DashboardPage = () => {
  const { profile } = useAuth();
  const { lessonPlans, isLoading: lessonPlansLoading } = useLessonPlans();
  const { students, isLoading: studentsLoading } = useStudents();

  // Calculate real stats from data
  const totalLessonPlans = lessonPlans?.length || 0;
  const activeLessonPlans = lessonPlans?.filter(plan => plan.status === 'active').length || 0;
  const completedLessonPlans = lessonPlans?.filter(plan => plan.status === 'completed').length || 0;
  const totalStudents = students?.length || 0;

  const stats = [
    {
      title: "Lesson Plans Created",
      value: totalLessonPlans.toString(),
      icon: BookOpen,
      change: `${activeLessonPlans} active plans`,
      trend: "up"
    },
    {
      title: "Students Managed",
      value: totalStudents.toString(),
      icon: Users,
      change: profile?.grade_level ? `Grade ${profile.grade_level}` : "All grades",
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

  // Get recent lesson plans (last 3)
  const recentPlans = lessonPlans?.slice(0, 3).map(plan => ({
    title: plan.title,
    subject: plan.subject,
    created: new Date(plan.created_at).toLocaleDateString(),
    status: plan.status
  })) || [];

  const progressData = [
    {
      label: "Lesson Plans Completed",
      current: completedLessonPlans,
      total: totalLessonPlans,
      value: totalLessonPlans > 0 ? (completedLessonPlans / totalLessonPlans) * 100 : 0
    },
    {
      label: "Virtual Classes Tested",
      current: 5,
      total: 8,
      value: 62
    },
    {
      label: "Student Data Updated",
      current: totalStudents,
      total: totalStudents + 3,
      value: totalStudents > 0 ? (totalStudents / (totalStudents + 3)) * 100 : 0
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Welcome back, {profile?.teacher_name || 'Teacher'}
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening in your classroom today
          {profile?.grade_level && ` - ${profile.grade_level}`}
          {profile?.school_name && ` at ${profile.school_name}`}
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
            {recentPlans.length > 0 ? (
              recentPlans.map((plan, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                  <div>
                    <p className="font-medium text-foreground">{plan.title}</p>
                    <p className="text-sm text-muted-foreground">{plan.subject} • {plan.created}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    plan.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                    plan.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {plan.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No lesson plans yet</p>
                <p className="text-sm text-muted-foreground">Create your first lesson plan to see it here</p>
              </div>
            )}
          </div>
        </Card>

        {/* Progress Overview */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            This Week's Progress
          </h3>
          <div className="space-y-6">
            {progressData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{item.label}</span>
                  <span>{item.current}/{item.total}</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
