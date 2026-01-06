import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Student data types
export interface Student {
  id: number;
  name: string;
  email?: string;
  department: string;
  gpa: number;
  attendance: number;
  activity_score: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  status?: string;
  created_at?: string;
}

export interface Exam {
  id: number;
  name: string;
  exam_date: string;
  exam_time?: string;
  duration: string;
  room: string;
  subject_id?: number;
  status?: string;
  created_at?: string;
}

// Student Management Service
export const StudentSupabaseService = {
  // ============ STUDENTS ============

  // Get all students
  async getStudents(): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        console.error('Error fetching students:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Failed to fetch students:', error);
      return [];
    }
  },

  // Get single student by ID
  async getStudent(id: number): Promise<Student | null> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching student:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Failed to fetch student:', error);
      return null;
    }
  },

  // Create new student
  async createStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>): Promise<Student | null> {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          ...student,
          status: 'active'
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating student:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Failed to create student:', error);
      return null;
    }
  },

  // Update student
  async updateStudent(id: number, updates: Partial<Student>): Promise<Student | null> {
    try {
      const { data, error } = await supabase
        .from('students')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating student:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Failed to update student:', error);
      return null;
    }
  },

  // Delete student
  async deleteStudent(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting student:', error);
        throw error;
      }
      return true;
    } catch (error) {
      console.error('Failed to delete student:', error);
      return false;
    }
  },

  // Bulk import students
  async bulkImportStudents(students: Omit<Student, 'id' | 'created_at' | 'updated_at'>[]): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert(students.map(s => ({ ...s, status: 'active' })))
        .select();
      
      if (error) {
        console.error('Error bulk importing students:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Failed to bulk import students:', error);
      return [];
    }
  },

  // Search students
  async searchStudents(query: string): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,department.ilike.%${query}%`)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error searching students:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Failed to search students:', error);
      return [];
    }
  },

  // ============ SUBJECTS ============

  // Get all subjects
  async getSubjects(): Promise<Subject[]> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      return [];
    }
  },

  // Create subject
  async createSubject(subject: Omit<Subject, 'id' | 'created_at'>): Promise<Subject | null> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert([{ ...subject, status: 'active' }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create subject:', error);
      return null;
    }
  },

  // Update subject
  async updateSubject(id: number, updates: Partial<Subject>): Promise<Subject | null> {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update subject:', error);
      return null;
    }
  },

  // Delete subject
  async deleteSubject(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to delete subject:', error);
      return false;
    }
  },

  // ============ EXAMS ============

  // Get all exams
  async getExams(): Promise<Exam[]> {
    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('exam_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      return [];
    }
  },

  // Create exam
  async createExam(exam: Omit<Exam, 'id' | 'created_at'>): Promise<Exam | null> {
    try {
      const { data, error } = await supabase
        .from('exams')
        .insert([exam])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create exam:', error);
      return null;
    }
  },

  // Update exam
  async updateExam(id: number, updates: Partial<Exam>): Promise<Exam | null> {
    try {
      const { data, error } = await supabase
        .from('exams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update exam:', error);
      return null;
    }
  },

  // Delete exam
  async deleteExam(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to delete exam:', error);
      return false;
    }
  },

  // ============ REALTIME SUBSCRIPTIONS ============

  // Subscribe to student changes
  subscribeToStudents(callback: (students: Student[]) => void) {
    const subscription = supabase
      .from('students')
      .on('*', (payload) => {
        console.log('Student change detected:', payload);
        // Refetch students on any change
        this.getStudents().then(callback);
      })
      .subscribe();

    return subscription;
  },

  // Unsubscribe from changes
  unsubscribe(subscription: any) {
    if (subscription) {
      supabase.removeSubscription(subscription);
    }
  },

  // Fill activity scores for all students
  async fillActivityScores(): Promise<boolean> {
    try {
      const students = await this.getStudents();
      
      for (const student of students) {
        // If activity_score is null or 0, generate a random one
        if (!student.activity_score || student.activity_score === 0) {
          const randomScore = Math.floor(Math.random() * 10) + 1; // 1-10
          await this.updateStudent(student.id, {
            ...student,
            activity_score: randomScore
          });
        }
      }
      
      console.log(`Activity scores filled for ${students.length} students`);
      return true;
    } catch (error) {
      console.error('Error filling activity scores:', error);
      return false;
    }
  },
};

export default StudentSupabaseService;
