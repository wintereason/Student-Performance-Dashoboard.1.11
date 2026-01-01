import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, BookOpen, Loader, Pencil, Plus } from "lucide-react";
import { useStudents } from "../context/StudentContext";
import { EditMarksModal } from "./edit-marks-modal";

interface StudentMarksEntry {
  id: number;
  subject: string;
  assignment: number;
  test: number;
  project: number;
  quiz: number;
  totalMarks: number;
  maxMarks: number;
}

export function SubjectManagement() {
  const { students } = useStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [marksData, setMarksData] = useState<StudentMarksEntry[]>([]);
  const [editingMark, setEditingMark] = useState<StudentMarksEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [newSubjectData, setNewSubjectData] = useState({
    subject: "",
    assignment: 0,
    test: 0,
    project: 0,
    quiz: 0,
  });

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    if (!searchQuery) return [];
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toString().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, students]);

  // Fetch marks data when student is selected
  useEffect(() => {
    const fetchMarksData = async () => {
      if (!selectedStudent) {
        setMarksData([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/subjects/student/${selectedStudent.id}/marks`
        );
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setMarksData(result.data);
          }
        }
      } catch (error) {
        console.error("Error fetching marks:", error);
        setMarksData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarksData();
  }, [selectedStudent]);

  const handleEditClick = (mark: StudentMarksEntry) => {
    setEditingMark(mark);
    setIsEditModalOpen(true);
  };

  const handleSaveMarks = (updatedData: any) => {
    // Update marksData with new values
    setMarksData(
      marksData.map((m) =>
        m.id === updatedData.id
          ? {
              ...m,
              assignment: updatedData.assignment,
              test: updatedData.test,
              project: updatedData.project,
              quiz: updatedData.quiz,
              totalMarks: updatedData.marks,
            }
          : m
      )
    );
  };

  const handleAddSubject = async () => {
    if (!selectedStudent) {
      alert("Please select a student first");
      return;
    }

    if (!newSubjectData.subject.trim()) {
      alert("Please enter a subject name");
      return;
    }

    const totalMarks = newSubjectData.assignment + newSubjectData.test + newSubjectData.project + newSubjectData.quiz;
    
    if (totalMarks <= 0 || totalMarks > 100) {
      alert("Total marks must be between 1 and 100. Current total: " + totalMarks);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/subjects/student/${selectedStudent.id}/subjects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject_name: newSubjectData.subject.trim(),
            assignment: parseFloat(String(newSubjectData.assignment)) || 0,
            test: parseFloat(String(newSubjectData.test)) || 0,
            project: parseFloat(String(newSubjectData.project)) || 0,
            quiz: parseFloat(String(newSubjectData.quiz)) || 0,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert("Error adding subject: " + (error.error || "Unknown error"));
        return;
      }

      const result = await response.json();
      
      // Add new subject to marksData
      setMarksData([
        ...marksData,
        {
          id: result.data.id,
          subject: newSubjectData.subject.trim(),
          assignment: newSubjectData.assignment,
          test: newSubjectData.test,
          project: newSubjectData.project,
          quiz: newSubjectData.quiz,
          totalMarks: totalMarks,
          maxMarks: 100,
        },
      ]);

      // Reset form and close modal
      setNewSubjectData({ subject: "", assignment: 0, test: 0, project: 0, quiz: 0 });
      setIsAddSubjectModalOpen(false);
      alert("Subject added successfully!");
    } catch (error) {
      console.error("Error adding subject:", error);
      alert("Failed to add subject. Check console for details.");
    }
  };

  // Get student marks history
  const studentMarksHistory = useMemo(() => {
    return marksData;
  }, [marksData]);

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <CardHeader className="bg-slate-700/30">
        <div>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            Student Marks History
          </CardTitle>
          <CardDescription>View student assignment, test, project, and quiz marks by subject</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search student by roll no. or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Search Results Dropdown */}
        {searchQuery && filteredStudents.length > 0 && (
          <div className="mb-6 p-3 bg-slate-700/50 rounded-lg border border-slate-600 max-h-64 overflow-y-auto">
            <p className="text-xs text-slate-400 mb-2 font-semibold">Found {filteredStudents.length} student(s):</p>
            <div className="space-y-2">
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => {
                    setSelectedStudent(student);
                    setSearchQuery("");
                  }}
                  className="w-full text-left p-2 rounded hover:bg-slate-600/50 transition text-slate-100 flex justify-between items-center"
                >
                  <span>
                    <span className="font-semibold">#{student.id}</span> - {student.name}
                  </span>
                  <span className="text-xs text-slate-400">{student.department}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Student Info */}
        {selectedStudent && (
          <>
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-300 text-sm">Selected Student</p>
                  <h3 className="text-xl font-bold text-slate-100 mt-1">
                    #{selectedStudent.id} - {selectedStudent.name}
                  </h3>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="text-slate-400">
                      Department: <span className="text-slate-200">{selectedStudent.department}</span>
                    </span>
                    <span className="text-slate-400">
                      GPA: <span className="text-blue-400 font-semibold">{selectedStudent.gpa.toFixed(2)}</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition text-sm"
                >
                  Clear
                </button>
              </div>
            </div>

        {/* Marks History Table */}
            <div className="overflow-x-auto">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-100">Marks Breakdown</h3>
                {selectedStudent && marksData.length > 0 && (
                  <button
                    onClick={() => setIsAddSubjectModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm"
                    title="Add new subject marks"
                  >
                    <Plus className="w-4 h-4" />
                    Add Subject
                  </button>
                )}
              </div>
              <table className="w-full text-sm">
                <thead className="bg-slate-700/50 border-b border-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-300">Subject</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300">Assignment</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300">Test</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300">Project</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300">Quiz</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300">Total</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300">Percentage</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2 justify-center">
                          <Loader className="w-5 h-5 animate-spin" />
                          <p>Loading marks...</p>
                        </div>
                      </td>
                    </tr>
                  ) : studentMarksHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <BookOpen className="w-8 h-8 opacity-50" />
                          <p>No marks recorded for this student yet.</p>
                          <p className="text-xs">Go to Subject Scores to add marks.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    studentMarksHistory.map((entry, idx) => {
                      const totalPossible = entry.maxMarks;
                      const percentage = (entry.totalMarks / totalPossible) * 100;
                      return (
                        <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                          <td className="px-4 py-3 font-medium text-slate-100">{entry.subject}</td>
                          <td className="px-4 py-3 text-center">
                            <Badge className="bg-blue-500/20 text-blue-400 font-semibold">
                              {entry.assignment}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge className="bg-purple-500/20 text-purple-400 font-semibold">
                              {entry.test}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge className="bg-green-500/20 text-green-400 font-semibold">
                              {entry.project}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge className="bg-yellow-500/20 text-yellow-400 font-semibold">
                              {entry.quiz}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-slate-600/50 text-slate-300 rounded font-semibold">
                              {entry.totalMarks}/{totalPossible}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-1 rounded font-semibold ${
                                percentage >= 80
                                  ? "bg-green-500/20 text-green-400"
                                  : percentage >= 60
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {Math.round(percentage)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleEditClick(entry)}
                              className="p-2 hover:bg-slate-600/50 rounded transition text-slate-300 hover:text-blue-400"
                              title="Edit marks"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* No Selection Message */}
        {!selectedStudent && (
          <div className="text-center py-12 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">Search for a student to view their marks history</p>
            <p className="text-sm mt-2">Enter student roll number or name above</p>
          </div>
        )}

        {/* Edit Marks Modal */}
        {editingMark && selectedStudent && (
          <EditMarksModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingMark(null);
            }}
            studentId={selectedStudent.id}
            subjectId={editingMark.id}
            subjectName={editingMark.subject}
            initialValues={{
              assignment: editingMark.assignment,
              test: editingMark.test,
              project: editingMark.project,
              quiz: editingMark.quiz,
            }}
            onSave={handleSaveMarks}
          />
        )}

        {/* Add Subject Modal */}
        {isAddSubjectModalOpen && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-slate-800 border-slate-700 w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="text-slate-100">Add Subject Marks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Subject Name */}
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Subject Name</label>
                    <Input
                      type="text"
                      placeholder="e.g., Mathematics, Physics, Chemistry"
                      value={newSubjectData.subject}
                      onChange={(e) =>
                        setNewSubjectData({ ...newSubjectData, subject: e.target.value })
                      }
                      className="bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500"
                    />
                  </div>

                  {/* Marks Breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Assignment (0-20)</label>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        value={newSubjectData.assignment === 0 ? "" : newSubjectData.assignment}
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            e.target.value = "";
                          }
                        }}
                        onChange={(e) =>
                          setNewSubjectData({
                            ...newSubjectData,
                            assignment: e.target.value === "" ? 0 : Math.min(20, Math.max(0, parseFloat(e.target.value) || 0)),
                          })
                        }
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setNewSubjectData({
                              ...newSubjectData,
                              assignment: 0,
                            });
                          }
                        }}
                        className="bg-slate-700 border-slate-600 text-slate-100 text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Test (0-25)</label>
                      <Input
                        type="number"
                        min="0"
                        max="25"
                        value={newSubjectData.test === 0 ? "" : newSubjectData.test}
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            e.target.value = "";
                          }
                        }}
                        onChange={(e) =>
                          setNewSubjectData({
                            ...newSubjectData,
                            test: e.target.value === "" ? 0 : Math.min(25, Math.max(0, parseFloat(e.target.value) || 0)),
                          })
                        }
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setNewSubjectData({
                              ...newSubjectData,
                              test: 0,
                            });
                          }
                        }}
                        className="bg-slate-700 border-slate-600 text-slate-100 text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Project (0-25)</label>
                      <Input
                        type="number"
                        min="0"
                        max="25"
                        value={newSubjectData.project === 0 ? "" : newSubjectData.project}
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            e.target.value = "";
                          }
                        }}
                        onChange={(e) =>
                          setNewSubjectData({
                            ...newSubjectData,
                            project: e.target.value === "" ? 0 : Math.min(25, Math.max(0, parseFloat(e.target.value) || 0)),
                          })
                        }
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setNewSubjectData({
                              ...newSubjectData,
                              project: 0,
                            });
                          }
                        }}
                        className="bg-slate-700 border-slate-600 text-slate-100 text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Quiz (0-15)</label>
                      <Input
                        type="number"
                        min="0"
                        max="15"
                        value={newSubjectData.quiz === 0 ? "" : newSubjectData.quiz}
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            e.target.value = "";
                          }
                        }}
                        onChange={(e) =>
                          setNewSubjectData({
                            ...newSubjectData,
                            quiz: e.target.value === "" ? 0 : Math.min(15, Math.max(0, parseFloat(e.target.value) || 0)),
                          })
                        }
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setNewSubjectData({
                              ...newSubjectData,
                              quiz: 0,
                            });
                          }
                        }}
                        className="bg-slate-700 border-slate-600 text-slate-100 text-center"
                      />
                    </div>
                  </div>

                  {/* Auto-calculated Total */}
                  <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600">
                    <p className="text-sm text-slate-400">Total Marks</p>
                    <p className="text-2xl font-bold text-slate-100">
                      {newSubjectData.assignment + newSubjectData.test + newSubjectData.project + newSubjectData.quiz}/100
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => {
                        setIsAddSubjectModalOpen(false);
                        setNewSubjectData({ subject: "", assignment: 0, test: 0, project: 0, quiz: 0 });
                      }}
                      className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSubject}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                    >
                      Add Subject
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
