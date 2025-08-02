
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser && !currentUser.id.startsWith('org_')) {
          // Fetch user profile
          setTimeout(async () => {
            await fetchProfile(currentUser.id);
          }, 0);
        } else if (!currentUser) {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser && !currentUser.id.startsWith('org_')) {
        fetchProfile(currentUser.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      // Type assertion to ensure proper typing
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, profileData: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: profileData
      }
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signInWithOrganization = async (username: string, password: string) => {
    try {
      // First, get the organization credentials
      const { data: credentials, error: credError } = await supabase
        .from('organization_credentials')
        .select(`
          *,
          organizations!inner(*)
        `)
        .eq('username', username)
        .single();

      if (credError || !credentials) {
        return { error: { message: 'Invalid username or password' } };
      }

      // For demo purposes, we'll use a simple password comparison
      // In production, you'd want to use proper password hashing
      if (password !== 'password123') {
        return { error: { message: 'Invalid username or password' } };
      }

      // Fetch the profile for the organization user
      const { data: orgProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('organization_id', credentials.organization_id)
        .eq('teacher_name', credentials.teacher_name)
        .single();

      if (profileError || !orgProfile) {
        return { error: { message: 'Could not find a profile for this organization user.' } };
      }
      
      setProfile(orgProfile as Profile);
      setUser({
        id: orgProfile.id,
        email: `${username}@${credentials.organizations.name.toLowerCase().replace(/\s+/g, '')}`,
        created_at: new Date().toISOString()
      } as User);

      toast({
        title: "Success",
        description: `Welcome back, ${credentials.teacher_name}!`,
      });

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: { message: 'No user logged in' } };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data as Profile);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithOrganization,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
