/**
 * Student Model
 * Defines the structure and types for student data
 */

export interface Student {
  id: number;
  name: string;
  department: string;
  gpa: number;
  attendance: number;
  activityScore: number;
}

export interface StudentStats {
  totalStudents: number;
  averageScore: number;
  attendanceRate: number;
  honorRoll: number;
  atRiskCount: number;
}

export interface StudentDetailModalData extends Student {
  performanceRank?: number;
  attendanceRank?: number;
  activityRank?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data?: T;
  error?: string;
}

export interface StudentListResponse extends ApiResponse<Student[]> {
  count: number;
  data: Student[];
}

/**
 * Helper functions for Student model
 */
export class StudentModel {
  /**
   * Calculate statistics from student list
   */
  static calculateStats(students: Student[]): StudentStats {
    if (students.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        attendanceRate: 0,
        honorRoll: 0,
        atRiskCount: 0,
      };
    }

    const totalStudents = students.length;
    const averageScore =
      students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents;
    const attendanceRate =
      students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents;
    const honorRoll = students.filter((s) => s.gpa >= 3.7).length;
    const atRiskCount = students.filter((s) => s.gpa < 2.5).length;

    return {
      totalStudents,
      averageScore,
      attendanceRate,
      honorRoll,
      atRiskCount,
    };
  }

  /**
   * Get top students by GPA
   */
  static getTopStudentsByGPA(students: Student[], count: number = 5): Student[] {
    return [...students]
      .sort((a, b) => b.gpa - a.gpa)
      .slice(0, count);
  }

  /**
   * Get top students by attendance
   */
  static getTopStudentsByAttendance(
    students: Student[],
    count: number = 5
  ): Student[] {
    return [...students]
      .sort((a, b) => b.attendance - a.attendance)
      .slice(0, count);
  }

  /**
   * Get top students by activity score
   */
  static getTopStudentsByActivity(
    students: Student[],
    count: number = 5
  ): Student[] {
    return [...students]
      .sort((a, b) => b.activityScore - a.activityScore)
      .slice(0, count);
  }

  /**
   * Get students at risk (GPA < 2.5)
   */
  static getAtRiskStudents(students: Student[]): Student[] {
    return students.filter((s) => s.gpa < 2.5);
  }

  /**
   * Get honor roll students (GPA >= 3.7)
   */
  static getHonorRollStudents(students: Student[]): Student[] {
    return students.filter((s) => s.gpa >= 3.7);
  }

  /**
   * Get students by department
   */
  static getStudentsByDepartment(
    students: Student[],
    department: string
  ): Student[] {
    return students.filter((s) => s.department === department);
  }

  /**
   * Get unique departments
   */
  static getDepartments(students: Student[]): string[] {
    return [...new Set(students.map((s) => s.department))];
  }

  /**
   * Calculate rank for a student by GPA
   */
  static getGPARank(students: Student[], studentId: number): number {
    const sorted = [...students].sort((a, b) => b.gpa - a.gpa);
    return sorted.findIndex((s) => s.id === studentId) + 1;
  }

  /**
   * Calculate rank for a student by attendance
   */
  static getAttendanceRank(students: Student[], studentId: number): number {
    const sorted = [...students].sort((a, b) => b.attendance - a.attendance);
    return sorted.findIndex((s) => s.id === studentId) + 1;
  }

  /**
   * Calculate rank for a student by activity score
   */
  static getActivityRank(students: Student[], studentId: number): number {
    const sorted = [...students].sort((a, b) => b.activityScore - a.activityScore);
    return sorted.findIndex((s) => s.id === studentId) + 1;
  }

  /**
   * Calculate overall performance score for a student
   * Formula: 50% GPA (normalized to 0-100) + 25% Attendance + 25% Activity Score
   * All metrics are assumed to be on a 0-100 scale except GPA which is 0-4.0
   */
  static calculateOverallPerformance(student: Student): number {
    const gpaScore = (student.gpa / 4.0) * 100;
    const attendanceScore = Math.min(student.attendance, 100); // Cap at 100
    const activityScore = Math.min(student.activityScore, 100); // Cap at 100
    
    const overall = (gpaScore * 0.5) + (attendanceScore * 0.25) + (activityScore * 0.25);
    return Math.min(overall, 100); // Cap final score at 100%
  }

  /**
   * Format student data for display
   */
  static formatStudentForDisplay(student: Student): Student {
    return {
      ...student,
      gpa: Math.round(student.gpa * 100) / 100,
    };
  }

  /**
   * Search students by name or department
   */
  static searchStudents(
    students: Student[],
    query: string
  ): Student[] {
    const lowerQuery = query.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.department.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get students sorted by field
   */
  static sortStudents(
    students: Student[],
    field: keyof Student,
    order: "asc" | "desc" = "desc"
  ): Student[] {
    return [...students].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return order === "desc" ? bValue - aValue : aValue - bValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "desc"
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }

      return 0;
    });
  }
}
