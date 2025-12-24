import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student } from '../models';
import { StudentService } from '../services';

interface StudentContextType {
  students: Student[];
  loading: boolean;
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

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await StudentService.getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const addStudent = (student: Student) => {
    console.log("Adding student:", student);
    setStudents((prev) => {
      const updated = [...prev, student];
      return updated.sort((a, b) => a.id - b.id);
    });
  };

  const updateStudent = (student: Student) => {
    console.log("Updating student:", student);
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? student : s))
        .sort((a, b) => a.id - b.id)
    );
  };

  const deleteStudent = (studentId: number) => {
    console.log("Deleting student:", studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const refreshStudents = async () => {
    setLoading(true);
    await fetchStudents();
  };

  const value: StudentContextType = {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    refreshStudents,
    fetchStudents,
  };

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
}
