
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Play, 
  Trash2,
  Calendar,
  Clock,
  Users
} from "lucide-react";

export const LessonPlanPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const lessonPlans = [
    {
      id: 1,
      title: "Introduction to Algebra",
      subject: "Mathematics",
      grade: "Grade 8",
      duration: "45 min",
      students: 28,
      created: "2024-01-15",
      status: "Active",
      description: "Basic algebraic concepts and solving simple equations"
    },
    {
      id: 2,
      title: "World War II History",
      subject: "History", 
      grade: "Grade 10",
      duration: "60 min",
      students: 24,
      created: "2024-01-12",
      status: "Draft",
      description: "Major events and consequences of World War II"
    },
    {
      id: 3,
      title: "Chemical Reactions",
      subject: "Science",
      grade: "Grade 9",
      duration: "50 min", 
      students: 26,
      created: "2024-01-08",
      status: "Completed",
      description: "Understanding chemical bonds and reaction types"
    },
    {
      id: 4,
      title: "Shakespeare's Romeo and Juliet",
      subject: "English",
      grade: "Grade 11",
      duration: "55 min",
      students: 22,
      created: "2024-01-05",
      status: "Active",
      description: "Character analysis and themes in Romeo and Juliet"
    }
  ];

  const filteredPlans = lessonPlans.filter(plan =>
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Lesson Plans
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your AI-generated lesson plans
          </p>
        </div>
        <Link to="/create-lesson-plan">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lesson plans..."
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

      {/* Lesson Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <Card key={plan.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <BookOpen className="h-6 w-6 text-primary" />
                <Badge className={getStatusColor(plan.status)}>
                  {plan.status}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg text-foreground">{plan.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {plan.subject}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {plan.grade}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {plan.duration}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(plan.created).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button size="sm" variant="outline" className="flex-1 border-border hover:bg-secondary">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                  <Play className="h-4 w-4 mr-2" />
                  Test
                </Button>
                <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No lesson plans found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "Create your first lesson plan to get started"}
          </p>
        </div>
      )}
    </div>
  );
};
