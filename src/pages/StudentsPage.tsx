
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { StudentCard } from "@/components/students/StudentCard";
import { AddStudentDialog } from "@/components/students/AddStudentDialog";
import { ClassroomSummary } from "@/components/students/ClassroomSummary";

export const StudentsPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { students, isLoading } = useStudents();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-secondary rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-secondary rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your student profiles and get AI-powered classroom insights
          </p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Classroom Summary */}
      <ClassroomSummary />

      {/* Students Grid */}
      {students.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">No students yet</h3>
          <p className="text-muted-foreground mb-6">
            Add your first student to start building your classroom profile
          </p>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Student
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
            />
          ))}
        </div>
      )}

      {/* Add Student Dialog */}
      <AddStudentDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
};
