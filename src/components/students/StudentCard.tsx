
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, TrendingUp, TrendingDown, Minus, BookOpen, Brain, Heart, Zap } from "lucide-react";
import { Student, useStudents } from "@/hooks/useStudents";
import { AddStudentDialog } from "./AddStudentDialog";

interface StudentCardProps {
  student: Student;
}

export const StudentCard = ({ student }: StudentCardProps) => {
  const { deleteStudent, isDeletingStudent } = useStudents();

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

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      deleteStudent(student.id);
    }
  };

  return (
    <Card className="p-6 bg-gray-900 border-gray-700 hover:border-purple-500/50 transition-colors">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center text-purple-400 font-semibold">
            {student.avatar || student.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-white">{student.name}</h3>
            <p className="text-sm text-gray-400">{student.grade}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Academic Level</span>
            <Badge className={getAcademicColor(student.academic_level)}>
              {student.academic_level}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Behavior</span>
            <Badge className={getBehaviorColor(student.behavior)}>
              {student.behavior}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Engagement</span>
            <div className="flex items-center gap-1">
              {getEngagementIcon(student.engagement)}
              <span className="text-sm text-white">{student.engagement}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Learning Style</span>
            <div className="flex items-center gap-1">
              {getLearningStyleIcon(student.learning_style)}
              <span className="text-sm text-white">{student.learning_style}</span>
            </div>
          </div>
        </div>

        {student.subjects && student.subjects.length > 0 && (
          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Subjects:</p>
            <div className="flex flex-wrap gap-1">
              {student.subjects.map((subject) => (
                <Badge key={subject} variant="outline" className="text-xs border-gray-600 text-gray-300">
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {student.notes && (
          <div className="pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Notes:</p>
            <p className="text-sm text-white">{student.notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <AddStudentDialog student={student} isEdit={true}>
            <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </AddStudentDialog>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDelete}
            disabled={isDeletingStudent}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
