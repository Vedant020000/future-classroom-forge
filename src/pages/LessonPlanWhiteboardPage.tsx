
import { useParams, useNavigate } from "react-router-dom";
import { ExcalidrawCanvas } from "@/components/whiteboard/ExcalidrawCanvas";
import { useEffect, useState } from "react";

// Mock lesson data - in real app this would come from database
const mockLessonData = {
  classroom: "5th Grade A",
  topic: "Rosa Parks & Civil Rights Movement",
  date: "2024-01-15",
  duration: "60 min",
  skillFocus: "Critical thinking, Historical analysis",
  learningGoals: "Students will understand the impact of individual actions on social change",
  studentDescription: "Mixed reading levels, engaged with social justice topics"
};

export const LessonPlanWhiteboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessonData, setLessonData] = useState(mockLessonData);

  useEffect(() => {
    // In a real app, you would fetch lesson data based on the ID
    // For now, we'll use mock data
    if (!id) {
      navigate('/lesson-plans');
    }
  }, [id, navigate]);

  return <ExcalidrawCanvas lessonData={lessonData} />;
};
