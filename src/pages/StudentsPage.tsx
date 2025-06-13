
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Brain,
  Heart,
  Zap
} from "lucide-react";

export const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const students = [
    {
      id: 1,
      name: "Alex Chen",
      grade: "Grade 8",
      academic: "Advanced",
      behavior: "Excellent",
      engagement: "High",
      learning_style: "Visual",
      notes: "Strong in mathematics, loves problem-solving",
      subjects: ["Mathematics", "Science"],
      avatar: "AC"
    },
    {
      id: 2,
      name: "Emma Rodriguez", 
      grade: "Grade 8",
      academic: "Grade Level",
      behavior: "Good",
      engagement: "Medium",
      learning_style: "Kinesthetic",
      notes: "Creative thinker, prefers hands-on activities",
      subjects: ["Art", "English"],
      avatar: "ER"
    },
    {
      id: 3,
      name: "Marcus Johnson",
      grade: "Grade 8", 
      academic: "Below Grade",
      behavior: "Needs Support",
      engagement: "Low",
      learning_style: "Auditory",
      notes: "Struggles with reading, responds well to verbal instruction",
      subjects: ["History", "Music"],
      avatar: "MJ"
    },
    {
      id: 4,
      name: "Sofia Patel",
      grade: "Grade 8",
      academic: "Advanced", 
      behavior: "Excellent",
      engagement: "High",
      learning_style: "Reading/Writing",
      notes: "Excellent communicator, peer leader",
      subjects: ["English", "History"],
      avatar: "SP"
    },
    {
      id: 5,
      name: "Jamie Williams",
      grade: "Grade 8",
      academic: "Grade Level",
      behavior: "Good", 
      engagement: "Medium",
      learning_style: "Visual",
      notes: "Quiet but thoughtful, needs encouragement to participate",
      subjects: ["Science", "Mathematics"],
      avatar: "JW"
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAcademicColor = (level: string) => {
    switch (level) {
      case 'Advanced': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Grade Level': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Below Grade': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getBehaviorColor = (behavior: string) => {
    switch (behavior) {
      case 'Excellent': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Needs Support': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getEngagementIcon = (engagement: string) => {
    switch (engagement) {
      case 'High': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'Medium': return <Minus className="h-4 w-4 text-yellow-400" />;
      case 'Low': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLearningStyleIcon = (style: string) => {
    switch (style) {
      case 'Visual': return <Brain className="h-4 w-4 text-purple-400" />;
      case 'Auditory': return <Zap className="h-4 w-4 text-blue-400" />;
      case 'Kinesthetic': return <Heart className="h-4 w-4 text-red-400" />;
      case 'Reading/Writing': return <BookOpen className="h-4 w-4 text-green-400" />;
      default: return <Brain className="h-4 w-4 text-gray-400" />;
    }
  };

  const stats = [
    { label: "Total Students", value: students.length, icon: Users },
    { label: "Advanced", value: students.filter(s => s.academic === 'Advanced').length, icon: TrendingUp },
    { label: "Grade Level", value: students.filter(s => s.academic === 'Grade Level').length, icon: Minus },
    { label: "Need Support", value: students.filter(s => s.academic === 'Below Grade').length, icon: TrendingDown }
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage student profiles and track academic progress
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic Performance</TabsTrigger>
          <TabsTrigger value="behavior">Behavior Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
            <Button variant="outline" className="border-border">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                      {student.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.grade}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Academic Level</span>
                      <Badge className={getAcademicColor(student.academic)}>
                        {student.academic}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Behavior</span>
                      <Badge className={getBehaviorColor(student.behavior)}>
                        {student.behavior}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Engagement</span>
                      <div className="flex items-center gap-1">
                        {getEngagementIcon(student.engagement)}
                        <span className="text-sm">{student.engagement}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Learning Style</span>
                      <div className="flex items-center gap-1">
                        {getLearningStyleIcon(student.learning_style)}
                        <span className="text-sm">{student.learning_style}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Notes:</p>
                    <p className="text-sm">{student.notes}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-border hover:bg-secondary">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold mb-4">Academic Performance Overview</h3>
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Academic performance tracking coming soon</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold mb-4">Behavior Tracking</h3>
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Behavior tracking dashboard coming soon</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <h3 className="text-lg font-semibold mb-4">Student Analytics</h3>
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Advanced analytics coming soon</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
