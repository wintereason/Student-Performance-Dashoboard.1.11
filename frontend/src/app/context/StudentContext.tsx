import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student } from '../models';
import { StudentSupabaseService } from '../services/SupabaseService';

interface StudentContextType {
  students: Student[];
  loading: boolean;
  error: string | null;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: number) => void;
  refreshStudents: () => Promise<void>;
  fetchStudents: () => Promise<void>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch ONLY from Supabase
      const data = await StudentSupabaseService.getStudents();
      setStudents(data || []);
      console.log("Fetched students from Supabase:", data);
    } catch (err) {
      console.error("Error fetching students from Supabase:", err);
      setError("Failed to fetch students from Supabase");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = (student: Student) => {
    console.log("Adding student to context:", student);
    setStudents((prev) => {
      const updated = [...prev, student];
      return updated.sort((a, b) => a.id - b.id);
    });
  };

  const updateStudent = async (student: Student) => {
    console.log("Updating student in context:", student);
    try {
      // Update in Supabase first
      const updated = await StudentSupabaseService.updateStudent(student.id, student);
      if (updated) {
        setStudents((prev) =>
          prev.map((s) => (s.id === student.id ? updated : s))
        );
      }
    } catch (err) {
      console.error("Error updating student:", err);
      setError("Failed to update student");
    }
  };

  const deleteStudent = async (studentId: number) => {
    console.log("Deleting student from context:", studentId);
    try {
      // Delete from Supabase first
      const success = await StudentSupabaseService.deleteStudent(studentId);
      if (success) {
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
      }
    } catch (err) {
      console.error("Error deleting student:", err);
      setError("Failed to delete student");
    }
  };

  const refreshStudents = async () => {
    await fetchStudents();
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        loading,
        error,
        addStudent,
        updateStudent,
        deleteStudent,
        refreshStudents,
        fetchStudents,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudents must be used within StudentProvider");
  }
  return context;
}
