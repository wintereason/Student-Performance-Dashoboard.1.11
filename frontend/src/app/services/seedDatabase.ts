import { StudentSupabaseService } from './SupabaseService';

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Sample subjects
    const subjects = [
      { name: 'Python', code: 'CS101', instructor: 'Dr. Sharma', credits: 4, status: 'Active' },
      { name: 'OS', code: 'CS102', instructor: 'Prof. Kumar', credits: 4, status: 'Active' },
      { name: 'M3', code: 'CS103', instructor: 'Dr. Patel', credits: 3, status: 'Active' },
      { name: 'DSA', code: 'CS104', instructor: 'Ms. Singh', credits: 4, status: 'Active' },
      { name: 'DELD', code: 'CS105', instructor: 'Dr. Verma', credits: 3, status: 'Active' },
    ];

    // Sample students
    const students = [
      { name: 'Rahul Sharma', email: 'rahul.sharma@college.edu', department: 'Computer Science', gpa: 3.8, attendance: 92, activity_score: 8.5, status: 'Active' },
      { name: 'Priya Singh', email: 'priya.singh@college.edu', department: 'Computer Science', gpa: 3.6, attendance: 88, activity_score: 8.0, status: 'Active' },
      { name: 'Aditya Patel', email: 'aditya.patel@college.edu', department: 'Computer Science', gpa: 3.2, attendance: 85, activity_score: 7.5, status: 'Active' },
      { name: 'Neha Gupta', email: 'neha.gupta@college.edu', department: 'Computer Science', gpa: 3.9, attendance: 95, activity_score: 9.0, status: 'Active' },
      { name: 'Vikram Kumar', email: 'vikram.kumar@college.edu', department: 'Computer Science', gpa: 2.8, attendance: 78, activity_score: 6.5, status: 'Active' },
      { name: 'Ananya Verma', email: 'ananya.verma@college.edu', department: 'Computer Science', gpa: 3.5, attendance: 89, activity_score: 8.2, status: 'Active' },
      { name: 'Rohan Singh', email: 'rohan.singh@college.edu', department: 'Computer Science', gpa: 3.1, attendance: 82, activity_score: 7.0, status: 'Active' },
      { name: 'Divya Iyer', email: 'divya.iyer@college.edu', department: 'Computer Science', gpa: 3.7, attendance: 91, activity_score: 8.8, status: 'Active' },
    ];

    // Sample exams with CT scores
    const exams = [
      { name: 'Python CT-1', exam_date: '2026-01-15', exam_time: '10:00', duration: '1 hour', room: 'A-101', ct1_score: 42, ct2_score: 45, status: 'Completed' },
      { name: 'Python CT-2', exam_date: '2026-01-20', exam_time: '10:00', duration: '1 hour', room: 'A-101', ct1_score: 44, ct2_score: 46, status: 'Completed' },
      { name: 'OS CT-1', exam_date: '2026-01-16', exam_time: '14:00', duration: '1 hour', room: 'B-205', ct1_score: 38, ct2_score: 40, status: 'Completed' },
      { name: 'OS CT-2', exam_date: '2026-01-21', exam_time: '14:00', duration: '1 hour', room: 'B-205', ct1_score: 41, ct2_score: 42, status: 'Completed' },
      { name: 'M3 CT-1', exam_date: '2026-01-17', exam_time: '09:00', duration: '1 hour', room: 'C-110', ct1_score: 45, ct2_score: 47, status: 'Completed' },
      { name: 'M3 CT-2', exam_date: '2026-01-22', exam_time: '09:00', duration: '1 hour', room: 'C-110', ct1_score: 46, ct2_score: 48, status: 'Completed' },
      { name: 'DSA CT-1', exam_date: '2026-01-18', exam_time: '11:00', duration: '1 hour', room: 'A-102', ct1_score: 48, ct2_score: 49, status: 'Completed' },
      { name: 'DSA CT-2', exam_date: '2026-01-23', exam_time: '11:00', duration: '1 hour', room: 'A-102', ct1_score: 49, ct2_score: 50, status: 'Completed' },
      { name: 'DELD CT-1', exam_date: '2026-01-19', exam_time: '13:00', duration: '1 hour', room: 'D-301', ct1_score: 43, ct2_score: 44, status: 'Completed' },
      { name: 'DELD CT-2', exam_date: '2026-01-24', exam_time: '13:00', duration: '1 hour', room: 'D-301', ct1_score: 45, ct2_score: 46, status: 'Completed' },
    ];

    // Insert subjects
    console.log('Inserting subjects...');
    for (const subject of subjects) {
      try {
        await StudentSupabaseService.createSubject(subject);
      } catch (error) {
        console.log(`Subject ${subject.name} may already exist or error occurred`);
      }
    }

    // Insert students
    console.log('Inserting students...');
    for (const student of students) {
      try {
        await StudentSupabaseService.createStudent(student);
      } catch (error) {
        console.log(`Student ${student.name} may already exist or error occurred`);
      }
    }

    // Insert exams
    console.log('Inserting exams...');
    for (const exam of exams) {
      try {
        await StudentSupabaseService.createExam(exam);
      } catch (error) {
        console.log(`Exam ${exam.name} may already exist or error occurred`);
      }
    }

    console.log('✅ Database seeding completed successfully!');
    return { success: true, message: 'Database seeded with sample data' };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return { success: false, message: 'Error seeding database', error };
  }
};
