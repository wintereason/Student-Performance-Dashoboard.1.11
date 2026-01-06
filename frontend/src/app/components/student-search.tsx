import { useState, useEffect } from "react";
import { useStudents } from "../context/StudentContext";
import { StudentSupabaseService } from "../services/SupabaseService";
import { StudentDetailModal } from "./student-detail-modal";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Search, User } from "lucide-react";

interface Student {
  id: number;
  name: string;
  department: string;
  gpa: number;
  attendance: number;
  activityScore: number;
}

export function StudentSearch() {
  const { students, loading } = useStudents();
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [supabaseSubjects, setSupabaseSubjects] = useState<any[]>([]);
  const [supabaseExams, setSupabaseExams] = useState<any[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch subjects and exams
    const fetchData = async () => {
      try {
        const [subjects, exams] = await Promise.all([
          StudentSupabaseService.getSubjects(),
          StudentSupabaseService.getExams(),
        ]);
        setSupabaseSubjects(subjects || []);
        setSupabaseExams(exams || []);
      } catch (err) {
        console.error("Error fetching subjects/exams:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Update filtered students when the students data changes
    if (students.length > 0) {
      const filtered = students
        .filter((student) => {
          const query = searchQuery.toLowerCase();
          return (
            student.name.toLowerCase().includes(query) ||
            student.id.toString().includes(query) ||
            student.department.toLowerCase().includes(query)
          );
        })
        .sort((a, b) => a.id - b.id);
      
      setFilteredStudents(filtered);
      setCurrentPage(1);
    }
  }, [students, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

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

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-400" />
            Search Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, roll number, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Students List ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-slate-400 py-8">
              <div>Loading students...</div>
              <div className="text-sm mt-2 text-slate-500">Please wait while we fetch your data</div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <div>No students available</div>
              <div className="text-sm mt-2 text-slate-500">The database appears to be empty</div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center text-slate-400 py-8">No students found matching your search.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-300">Roll No.</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-300">Name</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-300">Department</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-300">GPA</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-300">Attendance</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-300">Activity Score</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student) => (
                    <tr 
                      key={student.id} 
                      className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      <td className="px-4 py-3 text-sm text-slate-100 font-medium">
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">#{student.id}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-100 flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        {student.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">{student.department}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full font-medium ${
                          student.gpa >= 3.5 ? 'bg-green-500/20 text-green-400' :
                          student.gpa >= 3.0 ? 'bg-blue-500/20 text-blue-400' :
                          student.gpa >= 2.5 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {student.gpa.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full font-medium ${
                          student.attendance >= 90 ? 'bg-green-500/20 text-green-400' :
                          student.attendance >= 75 ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-medium">
                          {student.activityScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        {!loading && filteredStudents.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of {filteredStudents.length} students
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-600 text-slate-200 rounded-lg transition-colors font-medium"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageClick(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-600 text-slate-200 rounded-lg transition-colors font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <StudentDetailModal 
        student={selectedStudent} 
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        subjects={supabaseSubjects}
        exams={supabaseExams}
      />
    </div>
  );
}
