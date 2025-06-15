
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { StudentInsert, useStudents } from "@/hooks/useStudents";

const SUBJECTS = [
  "Mathematics", "Science", "English", "History", "Art", "Music", 
  "Physical Education", "Computer Science", "Foreign Language", "Geography"
];

interface AddStudentDialogProps {
  children?: React.ReactNode;
  student?: any; // For editing existing students
  isEdit?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AddStudentDialog = ({ children, student, isEdit = false, isOpen, onClose }: AddStudentDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const { addStudent, updateStudent, isAddingStudent, isUpdatingStudent } = useStudents();
  
  // Use external state if provided, otherwise use internal state
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = onClose !== undefined ? (value: boolean) => {
    if (!value) onClose();
  } : setInternalOpen;
  
  const [formData, setFormData] = useState<StudentInsert>({
    name: student?.name || "",
    grade: student?.grade || "",
    academic_level: student?.academic_level || "Grade Level",
    behavior: student?.behavior || "Good",
    engagement: student?.engagement || "Medium",
    learning_style: student?.learning_style || "Visual",
    notes: student?.notes || "",
    subjects: student?.subjects || [],
    avatar: student?.avatar || "",
  });

  const generateAvatar = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const studentData = {
      ...formData,
      avatar: formData.avatar || generateAvatar(formData.name),
    };

    if (isEdit && student) {
      updateStudent({ id: student.id, updates: studentData });
    } else {
      addStudent(studentData);
    }
    
    setOpen(false);
    // Reset form for new student
    if (!isEdit) {
      setFormData({
        name: "",
        grade: "",
        academic_level: "Grade Level",
        behavior: "Good",
        engagement: "Medium",
        learning_style: "Visual",
        notes: "",
        subjects: [],
        avatar: "",
      });
    }
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      subjects: checked 
        ? [...(prev.subjects || []), subject]
        : (prev.subjects || []).filter(s => s !== subject)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      {!children && (
        <DialogTrigger asChild>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isEdit ? "Edit Student" : "Add New Student"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="Enter student's full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade" className="text-white">Grade *</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                required
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="e.g., Grade 8"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Academic Level *</Label>
              <Select 
                value={formData.academic_level} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, academic_level: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Grade Level">Grade Level</SelectItem>
                  <SelectItem value="Below Grade">Below Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Behavior *</Label>
              <Select 
                value={formData.behavior} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, behavior: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Needs Support">Needs Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Engagement Level *</Label>
              <Select 
                value={formData.engagement} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, engagement: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Learning Style *</Label>
              <Select 
                value={formData.learning_style} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, learning_style: value }))}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="Visual">Visual</SelectItem>
                  <SelectItem value="Auditory">Auditory</SelectItem>
                  <SelectItem value="Kinesthetic">Kinesthetic</SelectItem>
                  <SelectItem value="Reading/Writing">Reading/Writing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Subjects</Label>
            <div className="grid grid-cols-3 gap-2">
              {SUBJECTS.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject}
                    checked={(formData.subjects || []).includes(subject)}
                    onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                  />
                  <Label htmlFor={subject} className="text-sm text-gray-300">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Additional notes about the student..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isAddingStudent || isUpdatingStudent}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAddingStudent || isUpdatingStudent ? "Saving..." : (isEdit ? "Update Student" : "Add Student")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
