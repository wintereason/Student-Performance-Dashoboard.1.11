import React, { useState, useEffect } from "react";
import { StudentSupabaseService } from "../services/SupabaseService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Trash2, Plus, Edit2 } from "lucide-react";

interface Student {
  id: number;
  name: string;
  email?: string;
  department: string;
  gpa: number;
  attendance: number;
  activity_score: number;
  status?: string;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  status?: string;
}

interface Exam {
  id: number;
  name: string;
  exam_date: string;
  exam_time?: string;
  duration: string;
  room: string;
  status?: string;
  ct1_score?: number;
  ct2_score?: number;
}

export function ManagementBoard() {
  const [supabaseStudents, setSupabaseStudents] = useState<Student[]>([]);
  const [supabaseSubjects, setSupabaseSubjects] = useState<Subject[]>([]);
  const [supabaseExams, setSupabaseExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<'students' | 'subjects' | 'exams' | 'attendance' | 'performance'>('students');
  
  // Dialog states - Students
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({});
  
  // Dialog states - Subjects
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isEditSubjectOpen, setIsEditSubjectOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjectFormData, setSubjectFormData] = useState<Partial<Subject>>({});

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [students, subjects, exams] = await Promise.all([
          StudentSupabaseService.getStudents(),
          StudentSupabaseService.getSubjects(),
          StudentSupabaseService.getExams(),
        ]);
        setSupabaseStudents(students);
        setSupabaseSubjects(subjects);
        setSupabaseExams(exams);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data from Supabase");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddStudent = async () => {
    if (!formData.name || !formData.department) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      const newStudent = await StudentSupabaseService.createStudent({
        name: formData.name,
        department: formData.department,
        gpa: formData.gpa || 0,
        attendance: formData.attendance || 0,
        activity_score: formData.activity_score || 0,
        email: formData.email,
      });
      if (newStudent) {
        setSupabaseStudents([...supabaseStudents, newStudent]);
        setIsAddStudentOpen(false);
        setFormData({});
      }
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Failed to add student");
    }
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent) return;
    try {
      const updated = await StudentSupabaseService.updateStudent(selectedStudent.id, formData);
      if (updated) {
        setSupabaseStudents(supabaseStudents.map(s => s.id === selectedStudent.id ? updated : s));
        setIsEditStudentOpen(false);
        setSelectedStudent(null);
        setFormData({});
      }
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Failed to update student");
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const success = await StudentSupabaseService.deleteStudent(id);
      if (success) {
        setSupabaseStudents(supabaseStudents.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student");
    }
  };

  // Subject CRUD handlers
  const handleAddSubject = async () => {
    if (!subjectFormData.name || !subjectFormData.code) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      const newSubject = await StudentSupabaseService.createSubject({
        name: subjectFormData.name,
        code: subjectFormData.code,
        instructor: subjectFormData.instructor || "",
        credits: subjectFormData.credits || 0,
        status: subjectFormData.status || "Active",
      });
      if (newSubject) {
        setSupabaseSubjects([...supabaseSubjects, newSubject]);
        setIsAddSubjectOpen(false);
        setSubjectFormData({});
      }
    } catch (err) {
      console.error("Error adding subject:", err);
      alert("Failed to add subject");
    }
  };

  const handleUpdateSubject = async () => {
    if (!selectedSubject) return;
    try {
      const updated = await StudentSupabaseService.updateSubject(selectedSubject.id, subjectFormData);
      if (updated) {
        setSupabaseSubjects(supabaseSubjects.map(s => s.id === selectedSubject.id ? updated : s));
        setIsEditSubjectOpen(false);
        setSelectedSubject(null);
        setSubjectFormData({});
      }
    } catch (err) {
      console.error("Error updating subject:", err);
      alert("Failed to update subject");
    }
  };

  const handleDeleteSubject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      const success = await StudentSupabaseService.deleteSubject(id);
      if (success) {
        setSupabaseSubjects(supabaseSubjects.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error("Error deleting subject:", err);
      alert("Failed to delete subject");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-300 mt-4">Loading from Supabase...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-red-400">
        <p className="font-semibold">Error: {error}</p>
        <p className="text-sm mt-2">Check your Supabase credentials in .env file</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Navigation Tabs */}
      <div className="flex gap-4 border-b border-slate-700 overflow-x-auto">
        <button
          onClick={() => setActivePage('students')}
          className={`px-6 py-3 font-medium transition-all whitespace-nowrap ${
            activePage === 'students'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          📚 Student Details
        </button>
        <button
          onClick={() => setActivePage('subjects')}
          className={`px-6 py-3 font-medium transition-all whitespace-nowrap ${
            activePage === 'subjects'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          📖 Subjects
        </button>
        <button
          onClick={() => setActivePage('exams')}
          className={`px-6 py-3 font-medium transition-all whitespace-nowrap ${
            activePage === 'exams'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          ✏️ Exams
        </button>
        <button
          onClick={() => setActivePage('attendance')}
          className={`px-6 py-3 font-medium transition-all whitespace-nowrap ${
            activePage === 'attendance'
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          ⚠️ At-Risk Students
        </button>
      </div>

      {/* Page Content */}
      <div className="bg-slate-900 rounded-lg p-6">
        {activePage === 'students' && <StudentDetailsPage 
          students={supabaseStudents}
          subjects={supabaseSubjects}
          exams={supabaseExams}
          onAddStudent={() => {
            setFormData({});
            setIsAddStudentOpen(true);
          }}
          onEditStudent={(student) => {
            setSelectedStudent(student);
            setFormData(student);
            setIsEditStudentOpen(true);
          }}
          onDeleteStudent={handleDeleteStudent}
        />}
        {activePage === 'subjects' && (
          <SubjectsPage
            subjects={supabaseSubjects}
            onAdd={() => {
              setSubjectFormData({});
              setIsAddSubjectOpen(true);
            }}
            onEdit={(subject) => {
              setSelectedSubject(subject);
              setSubjectFormData(subject);
              setIsEditSubjectOpen(true);
            }}
            onDelete={handleDeleteSubject}
          />
        )}
        {activePage === 'exams' && <ExamsPage exams={supabaseExams} subjects={supabaseSubjects} students={supabaseStudents} />}
        {activePage === 'attendance' && <AtRiskStudentsPage students={supabaseStudents} />}
        {activePage === 'performance' && <PerformanceReportsPage students={supabaseStudents} />}
      </div>

      {/* Add Student Dialog */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Student Name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              placeholder="Department"
              value={formData.department || ""}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <Input
              placeholder="GPA"
              type="number"
              step="0.1"
              max="4"
              value={formData.gpa || ""}
              onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
            />
            <Input
              placeholder="Attendance %"
              type="number"
              max="100"
              value={formData.attendance || ""}
              onChange={(e) => setFormData({ ...formData, attendance: parseFloat(e.target.value) })}
            />
            <Input
              placeholder="Activity Score"
              type="number"
              value={formData.activity_score || ""}
              onChange={(e) => setFormData({ ...formData, activity_score: parseFloat(e.target.value) })}
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsAddStudentOpen(false)}
              className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleAddStudent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Add Student
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditStudentOpen} onOpenChange={setIsEditStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Student Name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              placeholder="Department"
              value={formData.department || ""}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <Input
              placeholder="GPA"
              type="number"
              step="0.1"
              max="4"
              value={formData.gpa || ""}
              onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
            />
            <Input
              placeholder="Attendance %"
              type="number"
              max="100"
              value={formData.attendance || ""}
              onChange={(e) => setFormData({ ...formData, attendance: parseFloat(e.target.value) })}
            />
            <Input
              placeholder="Activity Score"
              type="number"
              value={formData.activity_score || ""}
              onChange={(e) => setFormData({ ...formData, activity_score: parseFloat(e.target.value) })}
            />
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsEditStudentOpen(false)}
              className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateStudent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Update Student
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Subject</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Subject Name"
              value={subjectFormData.name || ""}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Input
              placeholder="Subject Code"
              value={subjectFormData.code || ""}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, code: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Input
              placeholder="Instructor Name"
              value={subjectFormData.instructor || ""}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, instructor: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Input
              placeholder="Credits"
              type="number"
              value={subjectFormData.credits || ""}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, credits: parseInt(e.target.value) })}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <select
              value={subjectFormData.status || "Active"}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, status: e.target.value })}
              className="px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsAddSubjectOpen(false)}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSubject}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Add Subject
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={isEditSubjectOpen} onOpenChange={setIsEditSubjectOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Subject</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Subject Name"
              value={subjectFormData.name || ""}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, name: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Input
              placeholder="Subject Code"
              value={subjectFormData.code || ""}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, code: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Input
              placeholder="Instructor Name"
              value={subjectFormData.instructor || ""}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, instructor: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Input
              placeholder="Credits"
              type="number"
              value={subjectFormData.credits || ""}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, credits: parseInt(e.target.value) })}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <select
              value={subjectFormData.status || "Active"}
              onChange={(e) => setSubjectFormData({ ...subjectFormData, status: e.target.value })}
              className="px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsEditSubjectOpen(false)}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateSubject}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Update Subject
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Page 1: Student Details Table with CRUD
function StudentDetailsPage({ 
  students, 
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  subjects,
  exams
}: { 
  students: Student[],
  onAddStudent: () => void,
  onEditStudent: (student: Student) => void,
  onDeleteStudent: (id: number) => void,
  subjects: Subject[],
  exams: Exam[]
}) {
  const [expandedStudentId, setExpandedStudentId] = React.useState<number | null>(null);

  const getStudentExams = (studentId: number) => {
    const validSubjects = subjects.filter(subject =>
      exams.some(exam => exam.name.toLowerCase().includes(subject.name.toLowerCase()))
    );
    let ct1Total = 0;
    let ct2Total = 0;
    const studentExams = validSubjects.map(subject => {
      const exam = exams.find(e => e.name.toLowerCase().includes(subject.name.toLowerCase()));
      const ct1 = exam?.ct1_score || 0;
      const ct2 = exam?.ct2_score || 0;
      ct1Total += ct1;
      ct2Total += ct2;
      return { subject, exam, ct1, ct2 };
    });
    return { studentExams, ct1Total, ct2Total };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Student Details</h2>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              const success = await StudentSupabaseService.fillActivityScores();
              if (success) {
                alert('Activity scores filled successfully! Please refresh the page.');
              } else {
                alert('Failed to fill activity scores.');
              }
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
          >
            Fill Activity Scores
          </button>
          <button
            onClick={onAddStudent}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <Plus size={18} />
            Add Student
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800">
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Department</th>
              <th className="px-4 py-3 text-left font-semibold">Attendance %</th>
              <th className="px-4 py-3 text-left font-semibold">GPA</th>
              <th className="px-4 py-3 text-left font-semibold">Activity Score</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student: Student) => {
                const { studentExams, ct1Total, ct2Total } = getStudentExams(student.id);
                const isExpanded = expandedStudentId === student.id;
                return (
                  <React.Fragment key={student.id}>
                    <tr className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpandedStudentId(isExpanded ? null : student.id)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          {isExpanded ? '▼' : '▶'} {student.id}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-medium">{student.name}</td>
                      <td className="px-4 py-3">{student.department}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                              style={{ width: `${Math.min(student.attendance || 0, 100)}%` }}
                            />
                          </div>
                          <span>{(student.attendance || 0).toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          (student.gpa || 0) >= 3.5 ? 'bg-green-900/30 text-green-400' :
                          (student.gpa || 0) >= 3.0 ? 'bg-blue-900/30 text-blue-400' :
                          (student.gpa || 0) >= 2.5 ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-red-900/30 text-red-400'
                        }`}>
                          {(student.gpa || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {student.activity_score !== null && student.activity_score !== undefined && student.activity_score !== 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                                style={{ width: `${Math.min((student.activity_score || 0) * 10, 100)}%` }}
                              />
                            </div>
                            <span className="font-semibold text-purple-400">{(student.activity_score || 0).toFixed(1)}</span>
                          </div>
                        ) : (
                          <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-medium text-sm">
                            {student.activity_score !== null && student.activity_score !== undefined ? (student.activity_score || 0).toFixed(1) : 'Not Set'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => onEditStudent(student)}
                          className="p-2 text-blue-400 hover:bg-blue-900/30 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-2 text-red-400 hover:bg-red-900/30 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-800/30 border-b border-slate-700">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-white">Exam Marks - {student.name}</h4>
                            {studentExams.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {studentExams.map((item) => (
                                  <div key={item.subject.id} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600">
                                    <p className="text-sm font-semibold text-slate-100">{item.subject.name}</p>
                                    <p className="text-xs text-slate-400">{item.subject.code}</p>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                      <div className="bg-blue-900/20 rounded px-2 py-1 text-center">
                                        <p className="text-xs text-slate-400">CT1</p>
                                        <p className="text-sm font-bold text-blue-400">{item.ct1}</p>
                                      </div>
                                      <div className="bg-purple-900/20 rounded px-2 py-1 text-center">
                                        <p className="text-xs text-slate-400">CT2</p>
                                        <p className="text-sm font-bold text-purple-400">{item.ct2}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-400 text-sm">No exam marks available</p>
                            )}
                            {studentExams.length > 0 && (
                              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-600">
                                <div className="bg-blue-900/20 rounded-lg p-3 text-center">
                                  <p className="text-xs text-slate-400 uppercase">CT1 Total</p>
                                  <p className="text-2xl font-bold text-blue-400">{ct1Total}</p>
                                </div>
                                <div className="bg-purple-900/20 rounded-lg p-3 text-center">
                                  <p className="text-xs text-slate-400 uppercase">CT2 Total</p>
                                  <p className="text-2xl font-bold text-purple-400">{ct2Total}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-3 text-center text-slate-400">
                  No students found. Add one to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-slate-400 text-sm mt-4">Total Students: {students.length}</p>
    </div>
  );
}

// Page 2: Subjects Table
function SubjectsPage({ 
  subjects, 
  onAdd, 
  onEdit, 
  onDelete 
}: { 
  subjects: Subject[];
  onAdd: () => void;
  onEdit: (subject: Subject) => void;
  onDelete: (id: number) => void;
}) {
  if (subjects.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Subject Management</h2>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Add Subject
          </button>
        </div>
        <div className="text-center py-8 text-slate-400">
          <p>No subjects available in Supabase</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Subject Management</h2>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Subject
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800">
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Subject Name</th>
              <th className="px-4 py-3 text-left font-semibold">Code</th>
              <th className="px-4 py-3 text-left font-semibold">Instructor</th>
              <th className="px-4 py-3 text-left font-semibold">Credits</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-3">{subject.id}</td>
                <td className="px-4 py-3 font-medium">{subject.name}</td>
                <td className="px-4 py-3">{subject.code}</td>
                <td className="px-4 py-3">{subject.instructor}</td>
                <td className="px-4 py-3">{subject.credits}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    subject.status === 'Active' || subject.status === 'active'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-slate-900/30 text-slate-400'
                  }`}>
                    {subject.status || 'Active'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(subject)}
                      className="p-1 text-blue-400 hover:bg-blue-900/30 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(subject.id)}
                      className="p-1 text-red-400 hover:bg-red-900/30 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-slate-400 text-sm mt-4">Total Subjects: {subjects.length}</p>
    </div>
  );
}

// Page 3: Exams Table
function ExamsPage({ 
  exams, 
  subjects, 
  students 
}: { 
  exams: Exam[];
  subjects: Subject[];
  students: Student[];
}) {
  const [editingStudent, setEditingStudent] = React.useState<number | null>(null);
  const [formData, setFormData] = React.useState({
    python_ct1: '',
    python_ct2: '',
    os_ct1: '',
    os_ct2: '',
    dsa_ct1: '',
    dsa_ct2: '',
    m3_ct1: '',
    m3_ct2: '',
    deld_ct1: '',
    deld_ct2: ''
  });

  const getStudentExams = (studentId: number) => {
    const subjectNames = ['Python', 'OS', 'DSA', 'M3', 'DELD'];
    const studentExams = subjectNames.map(subjectName => {
      const subjectExams = exams.filter(exam => 
        exam.name.toLowerCase().includes(subjectName.toLowerCase())
      );
      const ct1 = subjectExams.find(e => e.name.toLowerCase().includes('ct-1') || e.name.toLowerCase().includes('ct1'))?.ct1_score || 0;
      const ct2 = subjectExams.find(e => e.name.toLowerCase().includes('ct-2') || e.name.toLowerCase().includes('ct2'))?.ct2_score || 0;
      return { subject: subjectName, ct1, ct2 };
    });
    
    const ct1Total = studentExams.reduce((sum, exam) => sum + (exam.ct1 || 0), 0);
    const ct2Total = studentExams.reduce((sum, exam) => sum + (exam.ct2 || 0), 0);
    
    return { studentExams, ct1Total, ct2Total };
  };

  const startEdit = (studentId: number) => {
    const { studentExams } = getStudentExams(studentId);
    setEditingStudent(studentId);
    setFormData({
      python_ct1: (studentExams[0]?.ct1 || '').toString(),
      python_ct2: (studentExams[0]?.ct2 || '').toString(),
      os_ct1: (studentExams[1]?.ct1 || '').toString(),
      os_ct2: (studentExams[1]?.ct2 || '').toString(),
      dsa_ct1: (studentExams[2]?.ct1 || '').toString(),
      dsa_ct2: (studentExams[2]?.ct2 || '').toString(),
      m3_ct1: (studentExams[3]?.ct1 || '').toString(),
      m3_ct2: (studentExams[3]?.ct2 || '').toString(),
      deld_ct1: (studentExams[4]?.ct1 || '').toString(),
      deld_ct2: (studentExams[4]?.ct2 || '').toString()
    });
  };

  const handleSaveMarks = async () => {
    try {
      // Update exam marks in database
      const subjectMap = [
        { name: 'Python', ct1: 'python_ct1', ct2: 'python_ct2' },
        { name: 'OS', ct1: 'os_ct1', ct2: 'os_ct2' },
        { name: 'DSA', ct1: 'dsa_ct1', ct2: 'dsa_ct2' },
        { name: 'M3', ct1: 'm3_ct1', ct2: 'm3_ct2' },
        { name: 'DELD', ct1: 'deld_ct1', ct2: 'deld_ct2' }
      ];

      for (const subject of subjectMap) {
        const ct1Exams = exams.filter(e => 
          e.name.toLowerCase().includes(subject.name.toLowerCase()) && 
          (e.name.toLowerCase().includes('ct-1') || e.name.toLowerCase().includes('ct1'))
        );
        const ct2Exams = exams.filter(e => 
          e.name.toLowerCase().includes(subject.name.toLowerCase()) && 
          (e.name.toLowerCase().includes('ct-2') || e.name.toLowerCase().includes('ct2'))
        );

        if (ct1Exams.length > 0) {
          await StudentSupabaseService.updateExam(ct1Exams[0].id, {
            ct1_score: parseFloat(formData[subject.ct1 as keyof typeof formData]) || 0
          });
        }
        if (ct2Exams.length > 0) {
          await StudentSupabaseService.updateExam(ct2Exams[0].id, {
            ct2_score: parseFloat(formData[subject.ct2 as keyof typeof formData]) || 0
          });
        }
      }

      alert(`Marks updated successfully for student!`);
      setEditingStudent(null);
    } catch (error) {
      console.error('Error saving marks:', error);
      alert('Error saving marks');
    }
  };

  const handleDeleteMarks = async (studentId: number) => {
    if (!confirm('Are you sure you want to delete all marks for this student?')) return;
    try {
      // Delete all exam records
      for (const exam of exams) {
        await StudentSupabaseService.deleteExam(exam.id);
      }
      alert('All marks deleted successfully!');
    } catch (error) {
      console.error('Error deleting marks:', error);
      alert('Error deleting marks');
    }
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setFormData({
      python_ct1: '',
      python_ct2: '',
      os_ct1: '',
      os_ct2: '',
      dsa_ct1: '',
      dsa_ct2: '',
      m3_ct1: '',
      m3_ct2: '',
      deld_ct1: '',
      deld_ct2: ''
    });
  };

  if (students.length === 0 || exams.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Exam Marks</h2>
        <div className="text-center py-8 text-slate-400">
          <p>No students or exam data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Exam Marks</h2>

      {/* Edit Form */}
      {editingStudent && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Edit Marks for {students.find(s => s.id === editingStudent)?.name}</h3>
            <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-200">✕</button>
          </div>
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-700">
                    <th className="px-2 py-2 text-left border border-slate-600">Subject</th>
                    <th className="px-2 py-2 text-center border border-slate-600">Current CT1</th>
                    <th className="px-2 py-2 text-center border border-slate-600">New CT1</th>
                    <th className="px-2 py-2 text-center border border-slate-600">Current CT2</th>
                    <th className="px-2 py-2 text-center border border-slate-600">New CT2</th>
                  </tr>
                </thead>
                <tbody>
                  {['Python', 'OS', 'DSA', 'M3', 'DELD'].map((subject, idx) => {
                    const { studentExams } = getStudentExams(editingStudent);
                    const currentScores = studentExams[idx];
                    return (
                      <tr key={subject} className="border-b border-slate-700 hover:bg-slate-800/50">
                        <td className="px-2 py-2 border border-slate-600 font-semibold text-blue-400">{subject}</td>
                        <td className="px-2 py-2 text-center border border-slate-600">
                          <span className="px-1 py-0.5 bg-blue-900/30 text-blue-400 rounded text-xs">{currentScores?.ct1 || '-'}</span>
                        </td>
                        <td className="px-2 py-2 border border-slate-600">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="50"
                            value={formData[`${subject.toLowerCase()}_ct1` as keyof typeof formData]}
                            onChange={(e) => setFormData({...formData, [`${subject.toLowerCase()}_ct1`]: e.target.value})}
                            className="w-full px-1 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs"
                          />
                        </td>
                        <td className="px-2 py-2 text-center border border-slate-600">
                          <span className="px-1 py-0.5 bg-purple-900/30 text-purple-400 rounded text-xs">{currentScores?.ct2 || '-'}</span>
                        </td>
                        <td className="px-2 py-2 border border-slate-600">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="50"
                            value={formData[`${subject.toLowerCase()}_ct2` as keyof typeof formData]}
                            onChange={(e) => setFormData({...formData, [`${subject.toLowerCase()}_ct2`]: e.target.value})}
                            className="w-full px-1 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveMarks}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
            >
              Save Marks
            </button>
            <button
              onClick={cancelEdit}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Exams Table - Student Centric View */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-300 border-collapse">
          <thead>
            <tr className="bg-slate-800">
              <th className="px-4 py-3 text-left font-semibold border border-slate-700">Student ID</th>
              <th className="px-4 py-3 text-left font-semibold border border-slate-700">Name</th>
              
              {/* Python Columns */}
              <th colSpan={2} className="px-4 py-3 text-center font-semibold border border-slate-700 bg-slate-700">Python</th>
              
              {/* OS Columns */}
              <th colSpan={2} className="px-4 py-3 text-center font-semibold border border-slate-700 bg-slate-700">OS</th>
              
              {/* DSA Columns */}
              <th colSpan={2} className="px-4 py-3 text-center font-semibold border border-slate-700 bg-slate-700">DSA</th>
              
              {/* M3 Columns */}
              <th colSpan={2} className="px-4 py-3 text-center font-semibold border border-slate-700 bg-slate-700">M3</th>
              
              {/* DELD Columns */}
              <th colSpan={2} className="px-4 py-3 text-center font-semibold border border-slate-700 bg-slate-700">DELD</th>
              
              {/* Totals */}
              <th className="px-4 py-3 text-center font-semibold border border-slate-700 bg-blue-900/20">CT1 Total</th>
              <th className="px-4 py-3 text-center font-semibold border border-slate-700 bg-purple-900/20">CT2 Total</th>
              
              {/* Actions */}
              <th className="px-4 py-3 text-center font-semibold border border-slate-700 bg-slate-700">Actions</th>
            </tr>
            
            {/* Sub-header row for CT1/CT2 */}
            <tr className="bg-slate-700/50">
              <th colSpan={2} className="border border-slate-700"></th>
              <th className="px-2 py-2 text-center text-xs font-semibold border border-slate-700 bg-blue-900/20 text-blue-400">CT1</th>
              <th className="px-2 py-2 text-center text-xs font-semibold border border-slate-700 bg-purple-900/20 text-purple-400">CT2</th>
              <th className="px-2 py-2 text-center text-xs font-semibold border border-slate-700 bg-blue-900/20 text-blue-400">CT1</th>
              <th className="px-2 py-2 text-center text-xs font-semibold border border-slate-700 bg-purple-900/20 text-purple-400">CT2</th>
              <th className="px-2 py-2 text-center text-xs font-semibold border border-slate-700 bg-blue-900/20 text-blue-400">CT1</th>
              <th className="px-2 py-2 text-center text-xs font-semibold border border-slate-700 bg-purple-900/20 text-purple-400">CT2</th>
              <th className="px-2 py-2 text-center text-xs font-semibold border border-slate-700 bg-blue-900/20 text-blue-400">CT1</th>
              <th className="px-2 py-2 text-center text-xs font-semibold border border-slate-700 bg-purple-900/20 text-purple-400">CT2</th>
              <th className="px-2 py-2 text-center text-xs font-semibold border border-slate-700 bg-blue-900/20 text-blue-400">CT1</th>
              <th className="px-2 py-2 text-center text-xs font-semibold border border-slate-700 bg-purple-900/20 text-purple-400">CT2</th>
              <th colSpan={2} className="border border-slate-700"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const { studentExams, ct1Total, ct2Total } = getStudentExams(student.id);
              return (
                <tr key={student.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 border border-slate-700 font-medium text-blue-400">{student.id}</td>
                  <td className="px-4 py-3 border border-slate-700 font-medium">{student.name}</td>
                  
                  {/* Python */}
                  <td className="px-4 py-3 text-center border border-slate-700">
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs font-semibold">
                      {studentExams[0]?.ct1 || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border border-slate-700">
                    <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs font-semibold">
                      {studentExams[0]?.ct2 || '-'}
                    </span>
                  </td>
                  
                  {/* OS */}
                  <td className="px-4 py-3 text-center border border-slate-700">
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs font-semibold">
                      {studentExams[1]?.ct1 || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border border-slate-700">
                    <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs font-semibold">
                      {studentExams[1]?.ct2 || '-'}
                    </span>
                  </td>
                  
                  {/* DSA */}
                  <td className="px-4 py-3 text-center border border-slate-700">
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs font-semibold">
                      {studentExams[2]?.ct1 || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border border-slate-700">
                    <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs font-semibold">
                      {studentExams[2]?.ct2 || '-'}
                    </span>
                  </td>
                  
                  {/* M3 */}
                  <td className="px-4 py-3 text-center border border-slate-700">
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs font-semibold">
                      {studentExams[3]?.ct1 || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border border-slate-700">
                    <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs font-semibold">
                      {studentExams[3]?.ct2 || '-'}
                    </span>
                  </td>
                  
                  {/* DELD */}
                  <td className="px-4 py-3 text-center border border-slate-700">
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs font-semibold">
                      {studentExams[4]?.ct1 || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border border-slate-700">
                    <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs font-semibold">
                      {studentExams[4]?.ct2 || '-'}
                    </span>
                  </td>
                  
                  {/* Totals */}
                  <td className="px-4 py-3 text-center border border-slate-700 font-semibold">
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs font-semibold">
                      {ct1Total}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center border border-slate-700 font-semibold">
                    <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs font-semibold">
                      {ct2Total}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 py-3 border border-slate-700 flex gap-2 justify-center">
                    <button
                      onClick={() => startEdit(student.id)}
                      className="p-2 text-blue-400 hover:bg-blue-900/30 rounded"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteMarks(student.id)}
                      className="p-2 text-red-400 hover:bg-red-900/30 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Page 4: At-Risk Students Table
function AtRiskStudentsPage({ students }: { students: Student[] }) {
  const [criteria, setCriteria] = React.useState({
    minGPA: 2.5,
    minAttendance: 70,
    minActivityScore: 5
  });
  const [editingCriteria, setEditingCriteria] = React.useState(false);
  const [tempCriteria, setTempCriteria] = React.useState(criteria);

  // Filter at-risk students based on custom criteria
  const atRiskStudents = students.filter((student) => {
    const gpa = student.gpa || 0;
    const attendance = student.attendance || 0;
    const activityScore = student.activity_score || 0;
    return gpa < criteria.minGPA || attendance < criteria.minAttendance || activityScore < criteria.minActivityScore;
  });

  const getRiskLevel = (student: Student) => {
    const gpa = student.gpa || 0;
    const attendance = student.attendance || 0;
    const activityScore = student.activity_score || 0;
    let riskCount = 0;
    if (gpa < criteria.minGPA) riskCount++;
    if (attendance < criteria.minAttendance) riskCount++;
    if (activityScore < criteria.minActivityScore) riskCount++;
    
    if (riskCount === 3) return { text: 'Critical', color: 'bg-red-900/30 text-red-400' };
    if (riskCount === 2) return { text: 'High', color: 'bg-orange-900/30 text-orange-400' };
    return { text: 'Medium', color: 'bg-yellow-900/30 text-yellow-400' };
  };

  const saveCriteria = () => {
    setCriteria(tempCriteria);
    setEditingCriteria(false);
  };

  const cancelEdit = () => {
    setTempCriteria(criteria);
    setEditingCriteria(false);
  };

  return (
    <div className="space-y-4">
      {/* Criteria Configuration Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">At-Risk Criteria</h3>
          <button
            onClick={() => {
              setEditingCriteria(!editingCriteria);
              setTempCriteria(criteria);
            }}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editingCriteria
                ? 'bg-slate-700 text-slate-300'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {editingCriteria ? 'Cancel' : 'Edit Criteria'}
          </button>
        </div>

        {editingCriteria ? (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-300">
                <thead>
                  <tr className="bg-slate-700 border-b border-slate-600">
                    <th className="px-4 py-2 text-left">Criterion</th>
                    <th className="px-4 py-2 text-center">Current Value</th>
                    <th className="px-4 py-2 text-center">New Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700 hover:bg-slate-800/30">
                    <td className="px-4 py-2">Minimum GPA</td>
                    <td className="px-4 py-2 text-center">
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">{criteria.minGPA.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="4"
                        value={tempCriteria.minGPA}
                        onChange={(e) => setTempCriteria({...tempCriteria, minGPA: parseFloat(e.target.value) || 0})}
                        className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700 hover:bg-slate-800/30">
                    <td className="px-4 py-2">Minimum Attendance %</td>
                    <td className="px-4 py-2 text-center">
                      <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">{criteria.minAttendance.toFixed(1)}%</span>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={tempCriteria.minAttendance}
                        onChange={(e) => setTempCriteria({...tempCriteria, minAttendance: parseFloat(e.target.value) || 0})}
                        className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-700 hover:bg-slate-800/30">
                    <td className="px-4 py-2">Minimum Activity Score</td>
                    <td className="px-4 py-2 text-center">
                      <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs">{criteria.minActivityScore.toFixed(1)}</span>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="10"
                        value={tempCriteria.minActivityScore}
                        onChange={(e) => setTempCriteria({...tempCriteria, minActivityScore: parseFloat(e.target.value) || 0})}
                        className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveCriteria}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                Save Criteria
              </button>
              <button
                onClick={cancelEdit}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="bg-slate-700 border-b border-slate-600">
                  <th className="px-4 py-2 text-left">Criterion</th>
                  <th className="px-4 py-2 text-center">Threshold</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700 hover:bg-slate-800/30">
                  <td className="px-4 py-2">Minimum GPA</td>
                  <td className="px-4 py-2 text-center">
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs font-semibold">{criteria.minGPA.toFixed(2)}</span>
                  </td>
                </tr>
                <tr className="border-b border-slate-700 hover:bg-slate-800/30">
                  <td className="px-4 py-2">Minimum Attendance %</td>
                  <td className="px-4 py-2 text-center">
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs font-semibold">{criteria.minAttendance.toFixed(1)}%</span>
                  </td>
                </tr>
                <tr className="border-b border-slate-700 hover:bg-slate-800/30">
                  <td className="px-4 py-2">Minimum Activity Score</td>
                  <td className="px-4 py-2 text-center">
                    <span className="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs font-semibold">{criteria.minActivityScore.toFixed(1)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* At-Risk Students List */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">At-Risk Students</h2>
        <span className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-sm font-semibold">
          {atRiskStudents.length} students
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800">
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Department</th>
              <th className="px-4 py-3 text-left font-semibold">GPA</th>
              <th className="px-4 py-3 text-left font-semibold">Attendance %</th>
              <th className="px-4 py-3 text-left font-semibold">Activity Score</th>
              <th className="px-4 py-3 text-left font-semibold">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {atRiskStudents.length > 0 ? (
              atRiskStudents.map((student) => {
                const riskLevel = getRiskLevel(student);
                return (
                  <tr key={student.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">{student.id}</td>
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    <td className="px-4 py-3">{student.department}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        (student.gpa || 0) >= 2.5
                          ? 'bg-blue-900/30 text-blue-400'
                          : 'bg-red-900/30 text-red-400'
                      }`}>
                        {(student.gpa || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              (student.attendance || 0) >= 70
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                : 'bg-gradient-to-r from-red-500 to-orange-600'
                            }`}
                            style={{ width: `${Math.min(student.attendance || 0, 100)}%` }}
                          />
                        </div>
                        <span className={`font-semibold text-xs ${
                          (student.attendance || 0) >= 70
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}>
                          {(student.attendance || 0).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        (student.activity_score || 0) >= 5
                          ? 'bg-blue-900/30 text-blue-400'
                          : 'bg-red-900/30 text-red-400'
                      }`}>
                        {(student.activity_score || 0).toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${riskLevel.color}`}>
                        {riskLevel.text}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-3 text-center text-slate-400">
                  🎉 No at-risk students! All students are performing well.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="text-slate-400 text-sm mt-4 space-y-2">
        <p><strong>Risk Criteria:</strong></p>
        <ul className="list-disc list-inside text-xs space-y-1">
          <li>GPA &lt; 2.5</li>
          <li>Attendance &lt; 70%</li>
          <li>Activity Score &lt; 5</li>
        </ul>
      </div>
    </div>
  );
}

// Page 5: Performance Reports Table
function PerformanceReportsPage({ students }: { students: Student[] }) {
  // Helper function to calculate CT1 and CT2 averages for a student
  const getStudentExamAverages = (studentId: number) => {
    const subjectNames = ['Python', 'OS', 'DSA', 'M3', 'DELD'];
    let totalCT1 = 0, totalCT2 = 0, ct1Count = 0, ct2Count = 0;

    subjectNames.forEach((subjectName) => {
      const subjectExams = exams.filter(exam => 
        exam.name.toLowerCase().includes(subjectName.toLowerCase())
      );
      
      const ct1Exam = subjectExams.find(e => e.name.toLowerCase().includes('ct-1') || e.name.toLowerCase().includes('ct1'));
      const ct2Exam = subjectExams.find(e => e.name.toLowerCase().includes('ct-2') || e.name.toLowerCase().includes('ct2'));

      if (ct1Exam && ct1Exam.ct1_score) {
        totalCT1 += ct1Exam.ct1_score;
        ct1Count++;
      }
      if (ct2Exam && ct2Exam.ct2_score) {
        totalCT2 += ct2Exam.ct2_score;
        ct2Count++;
      }
    });

    const avgCT1 = ct1Count > 0 ? totalCT1 / ct1Count : 0;
    const avgCT2 = ct2Count > 0 ? totalCT2 / ct2Count : 0;
    const overallExamAverage = ((avgCT1 + avgCT2) / 100) * 100;

    return {
      avgCT1: avgCT1.toFixed(2),
      avgCT2: avgCT2.toFixed(2),
      overallExamAverage: overallExamAverage.toFixed(2),
    };
  };

  const performanceData = students.map((student) => {
    const gpa = student.gpa || 0;
    const attendance = student.attendance || 0;
    const activityScore = student.activity_score || 0;
    const examAverages = getStudentExamAverages(student.id);
    
    // Calculate overall performance score based on exam averages
    const overallScore = parseFloat(examAverages.overallExamAverage);
    
    return {
      id: student.id,
      name: student.name,
      gpa: gpa.toFixed(2),
      attendance: attendance.toFixed(1),
      activityScore: activityScore.toFixed(1),
      avgCT1: examAverages.avgCT1,
      avgCT2: examAverages.avgCT2,
      overallScore: overallScore.toFixed(2),
      grade: overallScore >= 80 ? 'A+' : overallScore >= 70 ? 'A' : overallScore >= 60 ? 'B' : overallScore >= 50 ? 'C' : 'D',
    };
  });

  const getGradeColor = (grade: string) => {
    switch(grade) {
      case 'A+': return 'bg-green-900/30 text-green-400';
      case 'A': return 'bg-emerald-900/30 text-emerald-400';
      case 'B': return 'bg-blue-900/30 text-blue-400';
      case 'C': return 'bg-yellow-900/30 text-yellow-400';
      default: return 'bg-red-900/30 text-red-400';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Performance Reports</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800">
              <th className="px-4 py-3 text-left font-semibold">Student ID</th>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">CT1 Avg</th>
              <th className="px-4 py-3 text-left font-semibold">CT2 Avg</th>
              <th className="px-4 py-3 text-left font-semibold">Performance Score</th>
              <th className="px-4 py-3 text-left font-semibold">Grade</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.length > 0 ? (
              performanceData.map((record) => (
                <tr key={record.id} className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">{record.id}</td>
                  <td className="px-4 py-3 font-medium">{record.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(parseFloat(record.avgCT1) / 50) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-blue-400">{record.avgCT1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(parseFloat(record.avgCT2) / 50) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-purple-400">{record.avgCT2}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${Math.min(parseFloat(record.overallScore), 100)}%` }}
                        />
                      </div>
                      <span className="font-semibold">{record.overallScore}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(record.grade)}`}>
                      {record.grade}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-slate-400">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-slate-400 text-sm mt-4">Total Records: {performanceData.length}</p>
    </div>
  );
}
