import { useState } from "react";
import { useStudents } from "../context/StudentContext";
import { StudentDetailModal } from "./student-detail-modal";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Search, Plus, Pencil, Trash2, UserCircle } from "lucide-react";

interface Student {
  id: number;
  name: string;
  department: string;
  gpa: number;
  attendance: number;
  activityScore: number;
}

export function ManagementBoard() {
  const { students, loading, addStudent, updateStudent, deleteStudent } = useStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Student>({
    id: 0,
    name: "",
    department: "",
    gpa: 0,
    attendance: 0,
    activityScore: 0,
  });

  // At-Risk Criteria State
  const [atRiskCriteria, setAtRiskCriteria] = useState({
    minGPA: 2.5,
    minAttendance: 75,
    minActivityScore: 3,
  });

  const filteredStudents = students
    .filter((student) => {
      const query = searchQuery.toLowerCase();
      return (
        student.name.toLowerCase().includes(query) ||
        student.id.toString().includes(query) ||
        student.department.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => a.id - b.id);

  // Pagination calculations
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleAddStudent = () => {
    if (!formData.name || !formData.department) {
      alert("Please fill in all required fields");
      return;
    }
    const newStudent = {
      ...formData,
      id: Math.max(...students.map((s) => s.id), 0) + 1,
    };
    addStudent(newStudent);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditStudent = () => {
    if (!formData.name || !formData.department) {
      alert("Please fill in all required fields");
      return;
    }
    updateStudent(formData);
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteStudent = () => {
    if (currentStudent) {
      deleteStudent(currentStudent.id);
      setIsDeleteDialogOpen(false);
      setCurrentStudent(null);
    }
  };

  const openAddDialog = () => {
    resetForm();
    const maxId = Math.max(...students.map((s) => s.id), 0);
    setFormData({ ...formData, id: maxId + 1 });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (student: Student) => {
    setFormData(student);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (student: Student) => {
    setCurrentStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      name: "",
      department: "",
      gpa: 0,
      attendance: 0,
      activityScore: 0,
    });
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader className="bg-slate-700/30">
          <CardTitle className="text-slate-100">Student Management</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-slate-400">Loading students...</p>
            <p className="text-sm text-slate-500">Please wait while we fetch your data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <CardHeader className="bg-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-blue-400" />
            <CardTitle className="text-slate-100">Student Management</CardTitle>
          </div>
          <button
            onClick={openAddDialog}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add New Student
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name, roll number, or department..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-700/30">
                <th className="text-left px-4 py-3 font-semibold text-slate-300">Roll No.</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-300">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-300">Department</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-300">GPA</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-300">Attendance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-300">Activity Score</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-slate-700 hover:bg-slate-700/20 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedStudent(student);
                    setIsDetailModalOpen(true);
                  }}
                >
                  <td className="px-4 py-3">
                    <Badge className="bg-blue-500/20 text-blue-400">#{student.id}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-100 font-medium">{student.name}</td>
                  <td className="px-4 py-3 text-slate-300">{student.department}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        student.gpa >= 3.5
                          ? "bg-green-500/20 text-green-400"
                          : student.gpa >= 3.0
                          ? "bg-blue-500/20 text-blue-400"
                          : student.gpa >= 2.5
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {student.gpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        student.attendance >= 90
                          ? "bg-green-500/20 text-green-400"
                          : student.attendance >= 75
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-purple-500/20 text-purple-400">{student.activityScore}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditDialog(student)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteDialog(student)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              No students found matching your search.
            </div>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-sm text-slate-400">
            Showing {filteredStudents.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 rounded transition-colors text-sm font-medium"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageClick(pageNumber)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-100"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-100 rounded transition-colors text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>

        {/* At-Risk Students Criteria Configuration */}
        <div className="mt-8 pt-8 border-t border-slate-700">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 text-red-400">⚠️</div>
            <h3 className="text-lg font-bold text-slate-100">At-Risk Criteria Configuration</h3>
          </div>

          {/* Criteria Input Form */}
          <div className="bg-slate-700/30 p-6 rounded-lg border border-slate-600/50 mb-6">
            <p className="text-sm text-slate-400 mb-4">Set the thresholds below. Students below these values will be marked as at-risk:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">Minimum GPA</label>
                <Input
                  type="number"
                  min="0"
                  max="4"
                  step="0.1"
                  value={atRiskCriteria.minGPA}
                  onChange={(e) =>
                    setAtRiskCriteria({
                      ...atRiskCriteria,
                      minGPA: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
                <p className="text-xs text-slate-500">GPA below this value = risk</p>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">Minimum Attendance (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={atRiskCriteria.minAttendance}
                  onChange={(e) =>
                    setAtRiskCriteria({
                      ...atRiskCriteria,
                      minAttendance: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
                <p className="text-xs text-slate-500">Attendance below this = risk</p>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">Minimum Activity Score</label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={atRiskCriteria.minActivityScore}
                  onChange={(e) =>
                    setAtRiskCriteria({
                      ...atRiskCriteria,
                      minActivityScore: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
                <p className="text-xs text-slate-500">Activity score below this = risk</p>
              </div>
            </div>
          </div>

          {/* At-Risk Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Risk Level</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">GPA</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Attendance</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-300">Activity Score</th>
                </tr>
              </thead>
              <tbody>
                {students
                  .filter(
                    (student) =>
                      student.gpa < atRiskCriteria.minGPA ||
                      student.attendance < atRiskCriteria.minAttendance ||
                      student.activityScore < atRiskCriteria.minActivityScore
                  )
                  .map((student) => {
                    const riskFactors = [];
                    if (student.gpa < atRiskCriteria.minGPA) riskFactors.push("Low GPA");
                    if (student.attendance < atRiskCriteria.minAttendance) riskFactors.push("Low Attendance");
                    if (student.activityScore < atRiskCriteria.minActivityScore) riskFactors.push("Low Activity");

                    const riskLevel =
                      riskFactors.length >= 2
                        ? "Critical"
                        : riskFactors.length === 1
                        ? "Moderate"
                        : "Low";

                    return (
                      <tr
                        key={student.id}
                        className="border-b border-slate-700 hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-100 font-medium">{student.name}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded text-xs font-medium inline-block ${
                              riskLevel === "Critical"
                                ? "bg-red-500/20 text-red-400"
                                : riskLevel === "Moderate"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-orange-500/20 text-orange-400"
                            }`}
                          >
                            {riskLevel}
                          </span>
                          <div className="text-xs text-slate-400 mt-1">
                            {riskFactors.join(", ")}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              student.gpa >= atRiskCriteria.minGPA
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {student.gpa.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              student.attendance >= atRiskCriteria.minAttendance
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {student.attendance}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              student.activityScore >= atRiskCriteria.minActivityScore
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {student.activityScore}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {students.filter(
              (student) =>
                student.gpa < atRiskCriteria.minGPA ||
                student.attendance < atRiskCriteria.minAttendance ||
                student.activityScore < atRiskCriteria.minActivityScore
            ).length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No at-risk students found based on current criteria. All students are performing well!
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Add Student Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Add New Student</DialogTitle>
            <DialogDescription className="text-slate-400">Enter the details of the new student.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-slate-100"
                placeholder="Student name"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300">Department</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="bg-slate-700 border-slate-600 text-slate-100"
                placeholder="e.g., CS, IT, ECE"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">GPA</label>
                <Input
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
                  onFocus={(e) => { if (e.target.value === "0") e.target.value = ""; }}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">Attendance %</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: parseInt(e.target.value) })}
                  onFocus={(e) => { if (e.target.value === "0") e.target.value = ""; }}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">Activity Score</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.activityScore}
                  onChange={(e) => setFormData({ ...formData, activityScore: parseInt(e.target.value) })}
                  onFocus={(e) => { if (e.target.value === "0") e.target.value = ""; }}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsAddDialogOpen(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddStudent}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              Add Student
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Edit Student</DialogTitle>
            <DialogDescription className="text-slate-400">Update the student's information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300">Roll Number</label>
              <Input
                type="number"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: parseInt(e.target.value) || 0 })}
                className="bg-slate-700 border-slate-600 text-slate-100"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-slate-100"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300">Department</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="bg-slate-700 border-slate-600 text-slate-100"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">GPA</label>
                <Input
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                  value={formData.gpa}
                  onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
                  onFocus={(e) => { if (e.target.value === "0") e.target.value = ""; }}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">Attendance %</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.attendance}
                  onChange={(e) => setFormData({ ...formData, attendance: parseInt(e.target.value) })}
                  onFocus={(e) => { if (e.target.value === "0") e.target.value = ""; }}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-300">Activity Score</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.activityScore}
                  onChange={(e) => setFormData({ ...formData, activityScore: parseInt(e.target.value) })}
                  onFocus={(e) => { if (e.target.value === "0") e.target.value = ""; }}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setIsEditDialogOpen(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditStudent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Delete Student</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete {currentStudent?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteStudent}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StudentDetailModal 
        student={selectedStudent} 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </Card>
  );
}
