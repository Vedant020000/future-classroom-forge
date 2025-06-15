
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  Filter, 
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Brain,
  Heart,
  Zap,
  Loader2
} from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { AddStudentDialog } from "@/components/students/AddStudentDialog";
import { StudentCard } from "@/components/students/StudentCard";

export const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { students, isLoading, error } = useStudents();

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: "Total Students", value: students.length, icon: Users },
    { label: "Advanced", value: students.filter(s => s.academic_level === 'Advanced').length, icon: TrendingUp },
    { label: "Grade Level", value: students.filter(s => s.academic_level === 'Grade Level').length, icon: Minus },
    { label: "Need Support", value: students.filter(s => s.academic_level === 'Below Grade').length, icon: TrendingDown }
  ];

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-2">Error loading students</p>
            <p className="text-gray-400 text-sm">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-gray-400 mt-2">
            Manage student profiles and track academic progress
          </p>
        </div>
        <AddStudentDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-gray-900 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-purple-400" />
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
          <TabsTrigger value="academic" className="data-[state=active]:bg-purple-600">Academic Performance</TabsTrigger>
          <TabsTrigger value="behavior" className="data-[state=active]:bg-purple-600">Behavior Tracking</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-600">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white"
            />
          </div>

          {/* Students Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                <span className="text-white">Loading students...</span>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">
                {searchTerm ? "No students found" : "No students yet"}
              </p>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search" : "Add your first student to get started"}
              </p>
              {!searchTerm && <AddStudentDialog />}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="academic" className="space-y-6">
          <Card className="p-6 bg-gray-900 border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-white">Academic Performance Overview</h3>
            <div className="text-center py-12">
              <GraduationCap className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Academic performance tracking coming soon</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <Card className="p-6 bg-gray-900 border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-white">Behavior Tracking</h3>
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Behavior tracking dashboard coming soon</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="p-6 bg-gray-900 border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-white">Student Analytics</h3>
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Advanced analytics coming soon</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
