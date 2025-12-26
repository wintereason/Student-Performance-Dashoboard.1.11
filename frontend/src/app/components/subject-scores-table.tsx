import { useState, useMemo, useEffect } from "react";
import { useStudents } from "../context/StudentContext";
import { SubjectService } from "../services/SubjectService";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Plus, Trash2, BookOpen, Search, ChevronLeft, ChevronRight } from "lucide-react";

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

interface ManagedStudent {
  id: number;
  name: string;
  department: string;
  gpa: number;
  attendance: number;
  activityScore: number;
}

interface Props {
  managedStudents: ManagedStudent[];
}

export function SubjectScoresTable({ managedStudents = [] }: Props) {
  const { studentDatabase, setStudentDatabase } = useStudents();

  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newSubject, setNewSubject] = useState({
    name: "",
    marks: 0,
    maxMarks: 100,
  });

  // Filter students based on search from managed students
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return [];
    return managedStudents
      .map((s) => ({
        id: s.id.toString(),
        name: s.name,
      }))
      .filter(
        (s) =>
          s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [searchQuery, managedStudents]);

  const handleSelectStudent = (studentId: string, studentName: string) => {
    // Check if student exists in managed students
    const managedStudent = managedStudents.find((s) => s.id.toString() === studentId);
    if (!managedStudent) {
      alert("Please select a student from the Management Table first");
      return;
    }

    let student = studentDatabase.find((s) => s.studentId === studentId);
    if (!student) {
      student = {
        studentId,
        studentName,
        subjects: [],
      };
      setStudentDatabase([...studentDatabase, student]);
    }
    setSelectedStudent(student);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleAddSubject = async () => {
    // Validate inputs
    if (!selectedStudent) {
      alert("Please select a student first");
      return;
    }
    if (!newSubject.name || newSubject.name.trim() === "") {
      alert("Please enter a subject name");
      return;
    }
    if (newSubject.marks === "" || isNaN(newSubject.marks as any) || newSubject.marks < 0) {
      alert("Please enter valid marks");
      return;
    }
    if (newSubject.maxMarks === "" || isNaN(newSubject.maxMarks as any) || newSubject.maxMarks <= 0) {
      alert("Please enter valid max marks");
      return;
    }

    try {
      console.log("[Frontend] Adding subject:", { selectedStudent, newSubject });
      
      // Call API to add subject - this will persist to database
      const studentId = parseInt(selectedStudent.studentId);
      const marksNum = parseFloat(newSubject.marks.toString());
      const maxMarksNum = parseFloat(newSubject.maxMarks.toString());
      
      const result = await SubjectService.addSubjectScore(studentId, {
        id: 0,
        student_id: studentId,
        name: newSubject.name.trim(),
        marks: marksNum,
        maxMarks: maxMarksNum,
        percentage: (marksNum / maxMarksNum) * 100,
      });

      if (result && result.id) {
        console.log("[Frontend] Subject added successfully:", result);
        
        // Update local state with the response from server
        const updatedDatabase = studentDatabase.map((student) => {
          if (student.studentId === selectedStudent.studentId) {
            return {
              ...student,
              subjects: [
                ...student.subjects,
                {
                  id: result.id,
                  name: result.name,
                  marks: result.marks,
                  maxMarks: result.maxMarks,
                  percentage: result.percentage,
                },
              ],
            };
          }
          return student;
        });

        setStudentDatabase(updatedDatabase);
        const updatedStudent = updatedDatabase.find(
          (s) => s.studentId === selectedStudent.studentId
        );
        if (updatedStudent) {
          setSelectedStudent(updatedStudent);
        }
        
        // Reset form
        setNewSubject({ name: "", marks: 0, maxMarks: 100 });
      } else {
        console.error("[Frontend] API returned invalid response:", result);
        alert("Failed to add subject. Server returned no data. Check browser console for details.");
      }
    } catch (error) {
      console.error("[Frontend] Error adding subject:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Error adding subject:\n\n${errorMessage}\n\nCheck browser console (F12) for more details.`);
    }
  };

  const handleDeleteSubject = async (subjectId: number) => {
    if (!selectedStudent) return;

    try {
      const success = await SubjectService.deleteSubjectScore(subjectId);
      
      if (success) {
        setStudentDatabase(
          studentDatabase.map((student) => {
            if (student.studentId === selectedStudent.studentId) {
              return {
                ...student,
                subjects: student.subjects.filter((s) => s.id !== subjectId),
              };
            }
            return student;
          })
        );

        const updatedStudent = studentDatabase.find(
          (s) => s.studentId === selectedStudent.studentId
        );
        if (updatedStudent) {
          setSelectedStudent(updatedStudent);
        }
      } else {
        alert("Failed to delete subject");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      alert("Error deleting subject");
    }
  };

  const handleUpdateMarks = (subjectId: number, newMarks: number) => {
    if (!selectedStudent) return;

    setStudentDatabase(
      studentDatabase.map((student) => {
        if (student.studentId === selectedStudent.studentId) {
          return {
            ...student,
            subjects: student.subjects.map((s) => {
              if (s.id === subjectId) {
                const percentage = (newMarks / s.maxMarks) * 100;
                return {
                  ...s,
                  marks: newMarks,
                  percentage: Math.round(percentage * 100) / 100,
                };
              }
              return s;
            }),
          };
        }
        return student;
      })
    );

    const updatedStudent = studentDatabase.find(
      (s) => s.studentId === selectedStudent.studentId
    );
    if (updatedStudent) {
      setSelectedStudent(updatedStudent);
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500/20 text-green-400";
    if (percentage >= 80) return "bg-emerald-500/20 text-emerald-400";
    if (percentage >= 70) return "bg-blue-500/20 text-blue-400";
    if (percentage >= 60) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  const getGradeLabel = (percentage: number) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  // Pagination logic for student list
  const itemsPerPage = 5;
  const totalPages = Math.ceil(studentDatabase.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = studentDatabase.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const selectedStudentAverage =
    selectedStudent && selectedStudent.subjects.length > 0
      ? Math.round(
          (selectedStudent.subjects.reduce((sum, s) => sum + s.percentage, 0) /
            selectedStudent.subjects.length) *
            100
        ) / 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Student Selection Section */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader className="bg-slate-700/30">
          <CardTitle className="text-slate-100">Student Selection</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by Student ID or Name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filteredStudents.length > 0) {
                      const firstStudent = filteredStudents[0];
                      handleSelectStudent(firstStudent.id, firstStudent.name);
                    }
                  }}
                  onFocus={() =>
                    setShowSearchResults(searchQuery.length > 0)
                  }
                  className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500 text-sm pl-10"
                />
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-10">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() =>
                        handleSelectStudent(student.id, student.name)
                      }
                      className="w-full text-left px-4 py-3 hover:bg-slate-600 transition-colors border-b border-slate-600/50 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-slate-100 font-medium">
                          {student.name}
                        </span>
                        <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                          {student.id}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-slate-400 text-sm">
                    No students found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Student Info */}
          {selectedStudent && (
            <div className="mt-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">Selected Student</p>
                  <p className="text-lg font-bold text-slate-100">
                    {selectedStudent.studentName}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    ID: {selectedStudent.studentId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Total Subjects</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {selectedStudent.subjects.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subject Scores Table */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader className="bg-slate-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-400" />
              <CardTitle className="text-slate-100">
                Subject Scores Management
              </CardTitle>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Average Score</p>
              <p className="text-2xl font-bold text-slate-100">
                {selectedStudentAverage.toFixed(2)}%
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {!selectedStudent ? (
            <div className="text-center py-8 text-slate-400">
              Please select a student to add subject scores
            </div>
          ) : (
            <>
              {/* Add New Subject Search Row */}
              <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-slate-400 block mb-2">
                      Student: {selectedStudent.studentName}
                    </label>
                    <Input
                      type="text"
                      placeholder="Subject Name"
                      value={newSubject.name}
                      onChange={(e) =>
                        setNewSubject({ ...newSubject, name: e.target.value })
                      }
                      className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500 text-sm"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-slate-400 block mb-2">Marks</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Marks"
                      value={newSubject.marks === 0 ? "" : newSubject.marks}
                      onChange={(e) =>
                        setNewSubject({
                          ...newSubject,
                          marks: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-slate-100 text-center text-sm w-20 mx-auto"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-slate-400 block mb-2">Max</label>
                    <Input
                      type="number"
                      min="1"
                      step="0.1"
                      placeholder="Max"
                      value={newSubject.maxMarks}
                      onChange={(e) =>
                        setNewSubject({
                          ...newSubject,
                          maxMarks: e.target.value === "" ? 100 : parseFloat(e.target.value) || 100,
                        })
                      }
                      className="bg-slate-700 border-slate-600 text-slate-100 text-sm"
                    />
                  </div>
                  <button
                    onClick={handleAddSubject}
                    type="button"
                    disabled={!newSubject.name?.trim() || !selectedStudent || newSubject.marks === "" || newSubject.maxMarks === "" || newSubject.marks < 0 || newSubject.maxMarks <= 0}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Add Subject
                  </button>
                </div>
              </div>

              {/* Subjects Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-700/30">
                      <th className="text-left px-4 py-3 font-semibold text-slate-300">
                        Subject Name
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-300">
                        Marks
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-300">
                        Max Marks
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-300">
                        Percentage
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-300">
                        Grade
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.subjects.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-slate-400"
                        >
                          No subjects added yet. Add your first subject!
                        </td>
                      </tr>
                    ) : (
                      selectedStudent.subjects.map((subject) => (
                        <tr
                          key={subject.id}
                          className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                        >
                          <td className="px-4 py-4 text-slate-100 font-medium">
                            {subject.name}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Input
                              type="number"
                              min="0"
                              max={subject.maxMarks}
                              value={subject.marks}
                              onChange={(e) =>
                                handleUpdateMarks(
                                  subject.id,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="bg-slate-700 border-slate-600 text-slate-100 text-center text-sm w-20 mx-auto"
                            />
                          </td>
                          <td className="px-4 py-4 text-center text-slate-300">
                            {subject.maxMarks}
                          </td>
                          <td className="px-4 py-4 text-center text-slate-100 font-semibold">
                            {subject.percentage.toFixed(2)}%
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Badge
                              className={`${getGradeColor(
                                subject.percentage
                              )} text-xs font-bold`}
                            >
                              {getGradeLabel(subject.percentage)}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() =>
                                handleDeleteSubject(subject.id)
                              }
                              className="inline-flex items-center justify-center p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete subject"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              {selectedStudent.subjects.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <p className="text-xs text-slate-400 uppercase mb-2">
                      Total Subjects
                    </p>
                    <p className="text-2xl font-bold text-slate-100">
                      {selectedStudent.subjects.length}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <p className="text-xs text-slate-400 uppercase mb-2">
                      Total Marks
                    </p>
                    <p className="text-2xl font-bold text-slate-100">
                      {selectedStudent.subjects.reduce(
                        (sum, s) => sum + s.marks,
                        0
                      )}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <p className="text-xs text-slate-400 uppercase mb-2">
                      Max Marks
                    </p>
                    <p className="text-2xl font-bold text-slate-100">
                      {selectedStudent.subjects.reduce(
                        (sum, s) => sum + s.maxMarks,
                        0
                      )}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <p className="text-xs text-slate-400 uppercase mb-2">
                      Average %
                    </p>
                    <Badge
                      className={`${getGradeColor(
                        selectedStudentAverage
                      )} text-sm font-bold`}
                    >
                      {selectedStudentAverage.toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Student List with Pagination */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader className="bg-slate-700/30">
          <CardTitle className="text-slate-100">
            All Students - Subject Scores Database
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {studentDatabase.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No students in database yet
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedStudents.map((student) => (
                  <div
                    key={student.studentId}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedStudent?.studentId === student.studentId
                        ? "bg-blue-900/30 border-blue-600"
                        : "bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50"
                    }`}
                    onClick={() => {
                      setSelectedStudent(student);
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-100">
                          {student.studentName}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          ID: {student.studentId}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {student.subjects.length > 0 ? (
                            student.subjects.map((subject) => (
                              <Badge
                                key={subject.id}
                                className={`${getGradeColor(
                                  subject.percentage
                                )} text-xs`}
                              >
                                {subject.name}:{" "}
                                {subject.percentage.toFixed(0)}%
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500">
                              No subjects added
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Average</p>
                        <p className="text-lg font-bold text-slate-100">
                          {student.subjects.length > 0
                            ? (
                                student.subjects.reduce(
                                  (sum, s) => sum + s.percentage,
                                  0
                                ) / student.subjects.length
                              ).toFixed(1)
                            : "-"}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    onClick={() =>
                      setCurrentPage(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 rounded-lg transition-colors text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 rounded-lg transition-colors text-sm"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="mt-4 text-center text-sm text-slate-400">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, studentDatabase.length)} of{" "}
                {studentDatabase.length} students
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

