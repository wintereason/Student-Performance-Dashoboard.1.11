import { useMemo, useState, useEffect } from "react";
import { useStudents } from "../context/StudentContext";
import { StudentSupabaseService } from "../services/SupabaseService";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertTriangle, TrendingDown } from "lucide-react";
import { StudentDetailModal } from "./student-detail-modal";

export function AtRiskStudents() {
  const { students, loading } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [supabaseSubjects, setSupabaseSubjects] = useState<any[]>([]);
  const [supabaseExams, setSupabaseExams] = useState<any[]>([]);

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

  const atRiskStudents = useMemo(() => {
    return students
      .filter((student: any) => parseFloat(student.gpa) < 2.5)
      .map((student: any) => {
        const gpa = parseFloat(student.gpa);
        let riskLevel: "high" | "medium" | "low" = "low";
        
        if (gpa < 2.0) riskLevel = "high";
        else if (gpa < 2.5) riskLevel = "medium";
        
        return {
          id: student.id,
          name: student.name,
          gpa: gpa,
          attendance: student.attendance,
          riskLevel: riskLevel
        };
      })
      .sort((a: any, b: any) => a.gpa - b.gpa);
  }, [students]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  if (loading) return <div className="p-4 text-slate-400">Loading...</div>;

  return (
    <>
      <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          At-Risk Students
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Risk Level</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">GPA</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-slate-700 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="font-medium text-slate-100">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      className={`text-xs border ${getRiskColor(student.riskLevel)}`}
                      variant="outline"
                    >
                      {student.riskLevel.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`font-semibold ${
                        student.gpa < 2.0 ? "text-red-400" : "text-yellow-400"
                      }`}
                    >
                      {student.gpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`font-semibold ${
                        student.attendance < 75 ? "text-red-400" : "text-slate-100"
                      }`}
                    >
                      {student.attendance}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {atRiskStudents.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            No at-risk students found. All students are performing well!
          </div>
        )}
      </CardContent>
    </Card>
    <StudentDetailModal
      student={selectedStudent}
      isOpen={selectedStudent !== null}
      onClose={() => setSelectedStudent(null)}
      subjects={supabaseSubjects}
      exams={supabaseExams}
    />
  </>
  );
}
