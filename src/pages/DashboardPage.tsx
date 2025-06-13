
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Monitor, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const DashboardPage = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your teaching overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Lesson Plans
            </CardTitle>
            <BookOpen className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-gray-500">+2 from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Students
            </CardTitle>
            <Users className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">28</div>
            <p className="text-xs text-gray-500">Across 2 classes</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Virtual Sessions
            </CardTitle>
            <Monitor className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">5</div>
            <p className="text-xs text-gray-500">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Upcoming Classes
            </CardTitle>
            <PlusCircle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-gray-500">Next 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-400">
              Jump into your most common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link to="/create-lesson-plan">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Lesson Plan
              </Button>
            </Link>
            <Link to="/virtual-classroom">
              <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                <Monitor className="h-4 w-4 mr-2" />
                Enter Virtual Classroom
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">
              Your latest classroom activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Created "Math Fractions" lesson plan</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Updated student roster</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Completed virtual classroom session</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
