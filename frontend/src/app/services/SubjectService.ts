/**
 * Subject API Service
 * Handles all API calls for subject-related operations
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface Subject {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubjectResponse {
  success: boolean;
  data?: Subject | Subject[];
  total?: number;
  error?: string;
  message?: string;
}

interface SubjectScore {
  id: number;
  student_id: number;
  name: string;
  marks: number;
  maxMarks: number;
  percentage: number;
}

export class SubjectService {
  /**
   * Get all subjects for management
   */
  static async getAllSubjects(): Promise<Subject[]> {
    try {
      console.log('SubjectService: Fetching all subjects...');
      const response = await fetch(`${API_BASE_URL}/subjects/management`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SubjectResponse = await response.json();
      console.log('SubjectService: Subjects loaded', result);

      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error('SubjectService: Error fetching subjects:', error);
      return [];
    }
  }

  /**
   * Create a new subject
   */
  static async createSubject(name: string, description?: string): Promise<Subject | null> {
    try {
      console.log('SubjectService: Creating subject...', { name, description });

      const response = await fetch(`${API_BASE_URL}/subjects/management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }

      const result: SubjectResponse = await response.json();
      console.log('SubjectService: Subject created successfully', result);

      if (result.success && result.data && !Array.isArray(result.data)) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('SubjectService: Error creating subject:', error);
      throw error;
    }
  }

  /**
   * Update a subject
   */
  static async updateSubject(id: number, name?: string, description?: string): Promise<Subject | null> {
    try {
      console.log('SubjectService: Updating subject...', { id, name, description });

      const response = await fetch(`${API_BASE_URL}/subjects/management/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SubjectResponse = await response.json();
      console.log('SubjectService: Subject updated successfully', result);

      if (result.success && result.data && !Array.isArray(result.data)) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('SubjectService: Error updating subject:', error);
      throw error;
    }
  }

  /**
   * Delete a subject
   */
  static async deleteSubject(id: number): Promise<boolean> {
    try {
      console.log('SubjectService: Deleting subject...', { id });

      const response = await fetch(`${API_BASE_URL}/subjects/management/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SubjectResponse = await response.json();
      console.log('SubjectService: Subject deleted successfully', result);

      return result.success;
    } catch (error) {
      console.error('SubjectService: Error deleting subject:', error);
      throw error;
    }
  }

  /**
   * Get all subjects for a specific student
   */
  static async getStudentSubjects(studentId: string | number): Promise<SubjectScore[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/student/${studentId}/subjects`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success && result.data ? result.data : [];
    } catch (error) {
      console.error(`SubjectService: Error fetching subjects for student ${studentId}:`, error);
      return [];
    }
  }

  /**
   * Add a subject score for a student
   */
  static async addSubjectScore(
    studentId: number,
    subject: Omit<SubjectScore, 'id' | 'student_id'>
  ): Promise<SubjectScore | null> {
    try {
      const url = `${API_BASE_URL}/subjects/student/${studentId}/subjects`;
      const payload = {
        name: subject.name,
        marks: subject.marks,
        maxMarks: subject.maxMarks,
      };
      
      console.log('[SubjectService] Sending POST request to:', url);
      console.log('[SubjectService] Payload:', payload);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('[SubjectService] Response status:', response.status);
      console.log('[SubjectService] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[SubjectService] HTTP error! status: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('[SubjectService] Add subject response:', result);
      
      if (result.success && result.data) {
        console.log('[SubjectService] Subject added successfully:', result.data);
        return result.data;
      } else {
        console.error('[SubjectService] API returned error:', result.error || result.message);
        throw new Error(result.error || result.message || 'Unknown error from server');
      }
    } catch (error) {
      console.error('[SubjectService] Error adding subject score:', error);
      throw error;
    }
  }

  /**
   * Update a subject score
   */
  static async updateSubjectScore(
    subjectId: number,
    updates: Partial<SubjectScore>
  ): Promise<SubjectScore | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/subject/${subjectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success && result.data ? result.data : null;
    } catch (error) {
      console.error(`SubjectService: Error updating subject ${subjectId}:`, error);
      return null;
    }
  }

  /**
   * Delete a subject score
   */
  static async deleteSubjectScore(subjectId: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/subject/${subjectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error(`SubjectService: Error deleting subject ${subjectId}:`, error);
      return false;
    }
  }

  /**
   * Get statistics for all subjects
   */
  static async getAllSubjectsStats(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/students/subjects-stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success && result.data ? result.data : [];
    } catch (error) {
      console.error('SubjectService: Error fetching subjects stats:', error);
      return [];
    }
  }

  /**
   * Export all subject scores for all students
   */
  static async exportAllSubjects(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/students/subjects-export`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success && result.data ? result.data : [];
    } catch (error) {
      console.error('SubjectService: Error exporting subjects:', error);
      return [];
    }
  }
}
