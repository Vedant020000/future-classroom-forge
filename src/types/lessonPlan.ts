
export interface LessonPlan {
  id: string;
  teacher_id: string;
  title: string;
  subject: string;
  grade_level: string;
  description: string | null;
  duration: number | null;
  file_path: string | null;
  file_name: string | null;
  file_type: string;
  file_size: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationLessonPlan {
  id: string;
  organization_id: string;
  teacher_id: string;
  title: string;
  subject: string;
  grade_level: string;
  description: string | null;
  duration: number | null;
  file_path: string | null;
  file_name: string | null;
  file_type: string;
  file_size: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface UploadLessonPlanData {
  file: File;
  title: string;
  subject: string;
  grade_level: string;
  description?: string;
  duration?: number;
}
