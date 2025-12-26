import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student } from '../models';
import { StudentService } from '../services';
import { SubjectService } from '../services/SubjectService';

interface SubjectScore {
  id: number;
  name: string;
  marks: number;
  maxMarks: number;
  percentage: number;
}

interface StudentData {
  studentId: string;
  studentName: string;
  subjects: SubjectScore[];
}

interface StudentContextType {
  students: Student[];
  loading: boolean;
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: number) => void;
  refreshStudents: () => Promise<void>;
  fetchStudents: () => Promise<void>;
  studentDatabase: StudentData[];
  setStudentDatabase: (data: StudentData[]) => void;
  addSubjectToStudent: (studentId: string, studentName: string, subject: SubjectScore) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentDatabase, setStudentDatabase] = useState<StudentData[]>([]);

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

  const loadSubjectDatabase = async () => {
    try {
      console.log("[Context] Loading subject database from API...");
      // Fetch all students with their subjects from the database
      const students = await StudentService.getAllStudents();
      const subjectData: StudentData[] = [];

      for (const student of students) {
        const subjects = await SubjectService.getStudentSubjects(student.id);
        if (subjects && subjects.length > 0) {
          subjectData.push({
            studentId: student.id.toString(),
            studentName: student.name,
            subjects: subjects.map((s: any) => ({
              id: s.id,
              name: s.name || s.subject_name,
              marks: s.marks,
              maxMarks: s.maxMarks,
              percentage: s.percentage,
            })),
          });
        }
      }

      console.log("[Context] Loaded subject database from API:", subjectData);
      setStudentDatabase(subjectData);
    } catch (error) {
      console.error("[Context] Error loading subject database:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    loadSubjectDatabase();
  }, []);

  const addStudent = (student: Student) => {
    console.log("Adding student:", student);
    setStudents((prev) => {
      const updated = [...prev, student];
      return updated.sort((a, b) => a.id - b.id);
    });
  };

  const updateStudent = async (student: Student) => {
    console.log("Updating student:", student);
    try {
      // Save to backend first
      const updatedStudent = await StudentService.updateStudent(student);
      if (updatedStudent) {
        // Update local state with response from backend
        setStudents((prev) =>
          prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
            .sort((a, b) => a.id - b.id)
        );
        console.log("Student updated successfully in backend and local state");
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const deleteStudent = (studentId: number) => {
    console.log("Deleting student:", studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const refreshStudents = async () => {
    setLoading(true);
    await fetchStudents();
  };

  const addSubjectToStudent = (studentId: string, studentName: string, subject: SubjectScore) => {
    setStudentDatabase((prev) => {
      let studentData = prev.find((s) => s.studentId === studentId);
      if (!studentData) {
        studentData = {
          studentId,
          studentName,
          subjects: [],
        };
        return [...prev, studentData];
      }
      return prev.map((s) => 
        s.studentId === studentId 
          ? { ...s, subjects: [...s.subjects, subject] }
          : s
      );
    });
  };

  const value: StudentContextType = {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    refreshStudents,
    fetchStudents,
    studentDatabase,
    setStudentDatabase,
    addSubjectToStudent,
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
