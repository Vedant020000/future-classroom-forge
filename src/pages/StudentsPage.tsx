
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Plus, UserCheck, AlertCircle, TrendingUp } from "lucide-react";

const mockStudents = [
  {
    id: 1,
    name: "Emma Thompson",
    grade: "4th Grade",
    academicLevel: "Advanced",
    behaviorNotes: "Enthusiastic learner, sometimes talks out of turn",
    strengths: ["Math", "Reading"],
    challenges: ["Focus during long lectures"],
    lastUpdated: "2024-01-15"
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    grade: "4th Grade",
    academicLevel: "Grade Level",
    behaviorNotes: "Quiet but engaged, needs encouragement to participate",
    strengths: ["Art", "Creative Writing"],
    challenges: ["Math word problems", "Public speaking"],
    lastUpdated: "2024-01-14"
  },
  {
    id: 3,
    name: "Sarah Kim",
    grade: "4th Grade",
    academicLevel: "Below Grade Level",
    behaviorNotes: "Hardworking, seeks extra help when needed",
    strengths: ["Science experiments", "Team collaboration"],
    challenges: ["Reading comprehension", "Math fluency"],
    lastUpdated: "2024-01-13"
  },
  {
    id: 4,
    name: "Michael Johnson",
    grade: "4th Grade",
    academicLevel: "Advanced",
    behaviorNotes: "Natural leader, helps peers with understanding",
    strengths: ["Problem solving", "Leadership"],
    challenges: ["Patience with struggling classmates"],
    lastUpdated: "2024-01-12"
  }
];

export const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAcademicLevelColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "bg-green-600";
      case "Grade Level":
        return "bg-blue-600";
      case "Below Grade Level":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const selectedStudentData = selectedStudent 
    ? mockStudents.find(s => s.id === selectedStudent)
    : null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-green-400" />
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Students</h1>
            <p className="text-gray-400">Manage classroom rosters and student data</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students..."
              className="bg-gray-800 border-gray-700 text-white pl-10"
            />
          </div>
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-white">{mockStudents.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Need Attention</p>
                <p className="text-2xl font-bold text-yellow-400">2</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white">Class Roster</h2>
          <div className="space-y-3">
            {filteredStudents.map((student) => (
              <Card 
                key={student.id}
                className={`bg-gray-800 border-gray-700 cursor-pointer transition-colors ${
                  selectedStudent === student.id ? 'border-blue-500' : 'hover:border-gray-600'
                }`}
                onClick={() => setSelectedStudent(student.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{student.name}</h3>
                      <p className="text-gray-400 text-sm">{student.grade}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getAcademicLevelColor(student.academicLevel)}>
                        {student.academicLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span>Updated: {student.lastUpdated}</span>
                    <span>Strengths: {student.strengths.length}</span>
                    <span>Challenges: {student.challenges.length}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Student Details */}
        <div>
          {selectedStudentData ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{selectedStudentData.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  Student Profile & Learning Data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                    <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
                    <TabsTrigger value="academic" className="text-xs">Academic</TabsTrigger>
                    <TabsTrigger value="behavior" className="text-xs">Behavior</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Academic Level</h4>
                      <Badge className={getAcademicLevelColor(selectedStudentData.academicLevel)}>
                        {selectedStudentData.academicLevel}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Recent Activity</h4>
                      <p className="text-gray-400 text-sm">Last updated: {selectedStudentData.lastUpdated}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Edit Profile</Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">View History</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="academic" className="space-y-4 mt-4">
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        Strengths
                      </h4>
                      <div className="space-y-1">
                        {selectedStudentData.strengths.map((strength, index) => (
                          <Badge key={index} variant="outline" className="border-green-600 text-green-400 mr-1">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                        Challenges
                      </h4>
                      <div className="space-y-1">
                        {selectedStudentData.challenges.map((challenge, index) => (
                          <Badge key={index} variant="outline" className="border-yellow-600 text-yellow-400 mr-1 mb-1">
                            {challenge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="behavior" className="space-y-4 mt-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Behavior Notes</h4>
                      <p className="text-gray-300 text-sm p-3 bg-gray-700 rounded">
                        {selectedStudentData.behaviorNotes}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-gray-400 text-lg mb-2">No Student Selected</h3>
                <p className="text-gray-500 text-sm">
                  Select a student from the list to view their detailed profile and learning data.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
