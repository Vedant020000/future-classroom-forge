import { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_type: 'individual' | 'organization';
  organization_id?: string;
  teacher_name: string;
  grade_level?: string;
  student_count?: number;
  subject_specialization?: string;
  years_experience?: number;
  school_name?: string;
  gemini_api_key?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, profileData: any) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithOrganization: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const mockUser: User = {
    id: 'mock-user-id',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  };

  const mockProfile: Profile = {
    id: 'mock-user-id',
    user_type: 'individual',
    teacher_name: 'Mock Teacher',
  };

  const value: AuthContextType = {
    user: mockUser,
    session: null,
    profile: mockProfile,
    loading: false,
    signIn: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signInWithGoogle: async () => ({ error: null }),
    signInWithOrganization: async () => ({ error: null }),
    signOut: async () => {},
    updateProfile: async () => ({ error: null }),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
