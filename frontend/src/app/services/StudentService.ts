/**
 * Student Service
 * Handles all API calls and data operations for students
 */

import { Student, StudentListResponse, StudentStats, StudentModel } from '../models';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class StudentService {
  /**
   * Fetch all students from the API
   */
  static async getAllStudents(): Promise<Student[]> {
    try {
      console.log('StudentService: Fetching all students...');
      const response = await fetch(`${API_BASE_URL}/students`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: StudentListResponse = await response.json();
      console.log('StudentService: API response received', result);

      const studentData = result.success && result.data ? result.data : [];

      if (!Array.isArray(studentData)) {
        console.error('StudentService: Student data is not an array:', studentData);
        return [];
      }

      // Transform and validate data
      const students = studentData
        .map((s: any) => this.normalizeStudent(s))
        .filter((s): s is Student => s !== null)
        .sort((a, b) => a.id - b.id);

      console.log(`StudentService: Successfully loaded ${students.length} students`);
      return students;
    } catch (error) {
      console.error('StudentService: Error fetching students:', error);
      return [];
    }
  }

  /**
   * Fetch a single student by ID
   */
  static async getStudentById(id: number): Promise<Student | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`);
      
      if (!response.ok) {
        return null;
      }

      const result = await response.json();
      return result.success && result.data ? this.normalizeStudent(result.data) : null;
    } catch (error) {
      console.error(`StudentService: Error fetching student ${id}:`, error);
      return null;
    }
  }

  /**
   * Update a student
   */
  static async updateStudent(student: Student): Promise<Student | null> {
    try {
      console.log(`StudentService: Updating student ${student.id}...`);
      const response = await fetch(`${API_BASE_URL}/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`StudentService: Student ${student.id} updated successfully`, result);
      return result.success && result.data ? this.normalizeStudent(result.data) : null;
    } catch (error) {
      console.error(`StudentService: Error updating student ${student.id}:`, error);
      return null;
    }
  }

  /**
   * Search students by query
   */
  static async searchStudents(query: string, students: Student[]): Promise<Student[]> {
    return StudentModel.searchStudents(students, query);
  }

  /**
   * Get students by department
   */
  static getStudentsByDepartment(department: string, students: Student[]): Student[] {
    return StudentModel.getStudentsByDepartment(students, department);
  }

  /**
   * Get top students by metric
   */
  static getTopStudents(
    students: Student[],
    metric: 'gpa' | 'attendance' | 'activity' = 'gpa',
    count: number = 5
  ): Student[] {
    switch (metric) {
      case 'attendance':
        return StudentModel.getTopStudentsByAttendance(students, count);
      case 'activity':
        return StudentModel.getTopStudentsByActivity(students, count);
      case 'gpa':
      default:
        return StudentModel.getTopStudentsByGPA(students, count);
    }
  }

  /**
   * Get at-risk students
   */
  static getAtRiskStudents(students: Student[]): Student[] {
    return StudentModel.getAtRiskStudents(students);
  }

  /**
   * Get honor roll students
   */
  static getHonorRollStudents(students: Student[]): Student[] {
    return StudentModel.getHonorRollStudents(students);
  }

  /**
   * Get all unique departments
   */
  static getDepartments(students: Student[]): string[] {
    return StudentModel.getDepartments(students);
  }

  /**
   * Calculate statistics
   */
  static calculateStats(students: Student[]): StudentStats {
    return StudentModel.calculateStats(students);
  }

  /**
   * Get statistics by department
   */
  static getStatsByDepartment(
    department: string,
    students: Student[]
  ): StudentStats {
    const deptStudents = StudentModel.getStudentsByDepartment(students, department);
    return StudentModel.calculateStats(deptStudents);
  }

  /**
   * Get student with rankings
   */
  static getStudentWithRankings(
    studentId: number,
    students: Student[]
  ): (Student & { gpaRank: number; attendanceRank: number; activityRank: number }) | null {
    const student = students.find((s) => s.id === studentId);
    if (!student) return null;

    return {
      ...student,
      gpaRank: StudentModel.getGPARank(students, studentId),
      attendanceRank: StudentModel.getAttendanceRank(students, studentId),
      activityRank: StudentModel.getActivityRank(students, studentId),
    };
  }

  /**
   * Sort students by field
   */
  static sortStudents(
    students: Student[],
    field: keyof Student,
    order?: 'asc' | 'desc'
  ): Student[] {
    return StudentModel.sortStudents(students, field, order);
  }

  /**
   * Normalize student data from API response
   */
  private static normalizeStudent(data: any): Student | null {
    try {
      return {
        id: typeof data.id === 'string' ? parseInt(data.id) : data.id || 0,
        name: String(data.name || '').trim(),
        department: String(data.department || '').trim(),
        gpa: typeof data.gpa === 'string' ? parseFloat(data.gpa) : (data.gpa || 0),
        attendance: typeof data.attendance === 'string' ? parseInt(data.attendance) : (data.attendance || 0),
        activityScore: typeof data.activityScore === 'string' ? parseInt(data.activityScore) : (data.activityScore || 0),
      };
    } catch (error) {
      console.error('StudentService: Error normalizing student:', data, error);
      return null;
    }
  }

  /**
   * Get distribution statistics for charts
   */
  static getGPADistribution(students: Student[]): { range: string; count: number }[] {
    const ranges = [
      { range: '3.7 - 4.0', min: 3.7, max: 4.0 },
      { range: '3.3 - 3.6', min: 3.3, max: 3.6 },
      { range: '2.9 - 3.2', min: 2.9, max: 3.2 },
      { range: '2.5 - 2.8', min: 2.5, max: 2.8 },
      { range: '< 2.5', min: 0, max: 2.4 },
    ];

    return ranges.map((r) => ({
      range: r.range,
      count: students.filter((s) => s.gpa >= r.min && s.gpa <= r.max).length,
    }));
  }

  /**
   * Get department distribution
   */
  static getDepartmentDistribution(
    students: Student[]
  ): { department: string; count: number }[] {
    const deptMap = new Map<string, number>();

    students.forEach((s) => {
      const current = deptMap.get(s.department) || 0;
      deptMap.set(s.department, current + 1);
    });

    return Array.from(deptMap.entries())
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get students grouped by department
   */
  static getStudentsGroupedByDepartment(
    students: Student[]
  ): { [department: string]: Student[] } {
    return students.reduce((acc, student) => {
      if (!acc[student.department]) {
        acc[student.department] = [];
      }
      acc[student.department].push(student);
      return acc;
    }, {} as { [department: string]: Student[] });
  }
}
