
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, BookOpen, Monitor, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const mockLessonPlans = [
  {
    id: 1,
    title: "Introduction to Fractions",
    subject: "Mathematics",
    grade: "4th Grade",
    duration: "45 minutes",
    status: "Draft",
    createdAt: "2024-01-15",
    lastModified: "2024-01-16"
  },
  {
    id: 2,
    title: "American Revolution Overview",
    subject: "History",
    grade: "5th Grade",
    duration: "60 minutes",
    status: "Ready",
    createdAt: "2024-01-10",
    lastModified: "2024-01-12"
  },
  {
    id: 3,
    title: "Plant Life Cycles",
    subject: "Science",
    grade: "3rd Grade",
    duration: "50 minutes",
    status: "Ready",
    createdAt: "2024-01-08",
    lastModified: "2024-01-08"
  }
];

export const LessonPlanPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-green-600";
      case "Draft":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Lesson Plans</h1>
          <p className="text-gray-400">Manage and organize your teaching materials</p>
        </div>
        <Link to="/create-lesson-plan">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson Plans List */}
        <div className="lg:col-span-2 space-y-4">
          {mockLessonPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`bg-gray-800 border-gray-700 cursor-pointer transition-colors ${
                selectedPlan === plan.id ? 'border-blue-500' : 'hover:border-gray-600'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white">{plan.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {plan.subject} • {plan.grade} • {plan.duration}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(plan.status)}>
                    {plan.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created: {plan.createdAt}
                    </span>
                  </div>
                  <span>Modified: {plan.lastModified}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Panel */}
        <div className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Actions</CardTitle>
              <CardDescription className="text-gray-400">
                {selectedPlan ? "Manage selected lesson plan" : "Select a lesson plan to see actions"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedPlan ? (
                <>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Edit Plan
                  </Button>
                  <Link to="/virtual-classroom" className="block">
                    <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Monitor className="h-4 w-4 mr-2" />
                      Test in Virtual Classroom
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    Duplicate Plan
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Delete Plan
                  </Button>
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Select a lesson plan to view available actions
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Plans:</span>
                  <span className="text-white">{mockLessonPlans.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ready:</span>
                  <span className="text-green-400">
                    {mockLessonPlans.filter(p => p.status === "Ready").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Draft:</span>
                  <span className="text-yellow-400">
                    {mockLessonPlans.filter(p => p.status === "Draft").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
