-- Insert sample subjects (if not exists)
INSERT INTO subjects (name, code, instructor, credits, status) VALUES
  ('Mathematics', 'CS101', 'Dr. Sharma', 4, 'Active'),
  ('Physics', 'CS102', 'Prof. Kumar', 4, 'Active'),
  ('Chemistry', 'CS103', 'Dr. Patel', 3, 'Active'),
  ('English', 'CS104', 'Ms. Singh', 3, 'Active'),
  ('Computer Science', 'CS105', 'Dr. Verma', 4, 'Active')
ON CONFLICT DO NOTHING;

-- Insert sample students (if not exists)
INSERT INTO students (name, email, department, gpa, attendance, activity_score, status) VALUES
  ('Rahul Sharma', 'rahul.sharma@college.edu', 'Computer Science', 3.8, 92, 8.5, 'Active'),
  ('Priya Singh', 'priya.singh@college.edu', 'Computer Science', 3.6, 88, 8.0, 'Active'),
  ('Aditya Patel', 'aditya.patel@college.edu', 'Computer Science', 3.2, 85, 7.5, 'Active'),
  ('Neha Gupta', 'neha.gupta@college.edu', 'Computer Science', 3.9, 95, 9.0, 'Active'),
  ('Vikram Kumar', 'vikram.kumar@college.edu', 'Computer Science', 2.8, 78, 6.5, 'Active'),
  ('Ananya Verma', 'ananya.verma@college.edu', 'Computer Science', 3.5, 89, 8.2, 'Active'),
  ('Rohan Singh', 'rohan.singh@college.edu', 'Computer Science', 3.1, 82, 7.0, 'Active'),
  ('Divya Iyer', 'divya.iyer@college.edu', 'Computer Science', 3.7, 91, 8.8, 'Active')
ON CONFLICT DO NOTHING;

-- Insert sample exams with CT scores
INSERT INTO exams (name, exam_date, exam_time, duration, room, ct1_score, ct2_score, status) VALUES
  ('Mathematics CT-1', '2026-01-15', '10:00', '1 hour', 'A-101', 45, 42, 'Scheduled'),
  ('Mathematics CT-2', '2026-01-20', '10:00', '1 hour', 'A-101', 44, 43, 'Scheduled'),
  
  ('Physics CT-1', '2026-01-16', '14:00', '1 hour', 'B-205', 38, 40, 'Scheduled'),
  ('Physics CT-2', '2026-01-21', '14:00', '1 hour', 'B-205', 42, 41, 'Scheduled'),
  
  ('Chemistry CT-1', '2026-01-17', '09:00', '1 hour', 'C-110', 42, 44, 'Scheduled'),
  ('Chemistry CT-2', '2026-01-22', '09:00', '1 hour', 'C-110', 46, 45, 'Scheduled'),
  
  ('English CT-1', '2026-01-18', '11:00', '1 hour', 'A-102', 48, 47, 'Scheduled'),
  ('English CT-2', '2026-01-23', '11:00', '1 hour', 'A-102', 49, 48, 'Scheduled'),
  
  ('Computer Science CT-1', '2026-01-19', '13:00', '1 hour', 'D-301', 50, 49, 'Scheduled'),
  ('Computer Science CT-2', '2026-01-24', '13:00', '1 hour', 'D-301', 48, 47, 'Scheduled')
ON CONFLICT DO NOTHING;
