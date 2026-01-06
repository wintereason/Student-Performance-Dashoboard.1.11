-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  exam_date DATE,
  exam_time TIME,
  duration VARCHAR(50),
  room VARCHAR(100),
  ct1_score DECIMAL(5,2),
  ct2_score DECIMAL(5,2),
  status VARCHAR(50) DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_exams_date ON exams(exam_date);
CREATE INDEX IF NOT EXISTS idx_exams_status ON exams(status);
CREATE INDEX IF NOT EXISTS idx_exams_name ON exams(name);

-- Enable RLS (Row Level Security)
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read" ON exams;
DROP POLICY IF EXISTS "Allow public insert" ON exams;
DROP POLICY IF EXISTS "Allow public update" ON exams;
DROP POLICY IF EXISTS "Allow public delete" ON exams;

-- Create RLS policies for public access (development mode)
CREATE POLICY "Allow public read" ON exams FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON exams FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON exams FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON exams FOR DELETE USING (true);

-- Insert sample exams with CT scores for Python, OS, M3, DSA, DELD subjects
INSERT INTO exams (name, exam_date, exam_time, duration, room, ct1_score, ct2_score, status) VALUES
  ('Python CT-1', '2026-01-15', '10:00', '1 hour', 'A-101', 42, 45, 'Completed'),
  ('Python CT-2', '2026-01-20', '10:00', '1 hour', 'A-101', 44, 46, 'Completed'),
  ('OS CT-1', '2026-01-16', '14:00', '1 hour', 'B-205', 38, 40, 'Completed'),
  ('OS CT-2', '2026-01-21', '14:00', '1 hour', 'B-205', 41, 42, 'Completed'),
  ('M3 CT-1', '2026-01-17', '09:00', '1 hour', 'C-110', 45, 47, 'Completed'),
  ('M3 CT-2', '2026-01-22', '09:00', '1 hour', 'C-110', 46, 48, 'Completed'),
  ('DSA CT-1', '2026-01-18', '11:00', '1 hour', 'A-102', 48, 49, 'Completed'),
  ('DSA CT-2', '2026-01-23', '11:00', '1 hour', 'A-102', 49, 50, 'Completed'),
  ('DELD CT-1', '2026-01-19', '13:00', '1 hour', 'D-301', 43, 44, 'Completed'),
  ('DELD CT-2', '2026-01-24', '13:00', '1 hour', 'D-301', 45, 46, 'Completed')
ON CONFLICT DO NOTHING;