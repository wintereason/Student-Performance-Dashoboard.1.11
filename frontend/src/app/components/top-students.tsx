import { useState, useMemo, useEffect } from "react";
import { useStudents } from "../context/StudentContext";
import { StudentSupabaseService } from "../services/SupabaseService";
import { StudentDetailModal } from "./student-detail-modal";
import { Student, StudentModel } from "../models";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Award, Trophy, Medal } from "lucide-react";

interface TopStudent extends Student {
  rank: number;
  overallPerformance: number;
  performanceRank: number;
  attendanceRank: number;
  activityRank: number;
  icon: React.ReactNode;
}

export function TopStudents() {
  const { students, loading } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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

  const topStudents = useMemo(() => {
    if (students.length === 0) return [];

    // Calculate overall performance for each student using StudentModel
    const studentsWithPerformance = students.map((student: Student) => ({
      ...student,
      overallPerformance: StudentModel.calculateOverallPerformance(student),
    }));

    // Get top 5 by overall performance
    const topFive = studentsWithPerformance
      .sort((a, b) => b.overallPerformance - a.overallPerformance)
      .slice(0, 5);

    // Map with additional ranking info
    return topFive.map((student, index) => {
      const performanceRank = StudentModel.getGPARank(students as Student[], student.id);
      const attendanceRank = StudentModel.getAttendanceRank(students as Student[], student.id);
      const activityRank = StudentModel.getActivityRank(students as Student[], student.id);

      let icon = <Medal className="h-4 w-4 text-gray-400" />;
      if (index === 0) {
        icon = <Trophy className="h-4 w-4 text-yellow-500" />;
      } else if (index === 1) {
        icon = <Medal className="h-4 w-4 text-slate-300" />;
      } else if (index === 2) {
        icon = <Medal className="h-4 w-4 text-orange-400" />;
      }

      return {
        ...student,
        rank: index + 1,
        icon,
        performanceRank,
        attendanceRank,
        activityRank,
      } as TopStudent;
    });
  }, [students]);

  if (loading) {
    return <div className="p-4 text-slate-400">Loading...</div>;
  }

  return (
    <>
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-400" />
            Top Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {topStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-2 rounded p-1 bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer text-xs"
                onClick={() => {
                  setSelectedStudent(student);
                  setIsDetailModalOpen(true);
                }}
              >
                {/* Rank Icon */}
                <div className="flex-shrink-0">
                  {student.icon}
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="font-medium text-slate-100 truncate text-xs">{student.name}</p>
                    <Badge className="bg-slate-700 text-slate-200 text-xs py-0 px-1">
                      #{student.rank}
                    </Badge>
                  </div>
                  
                  {/* Performance Breakdown */}
                  <div className="flex gap-1 text-xs">
                    <span className="text-slate-400">{student.overallPerformance.toFixed(1)}%</span>
                    <Badge variant="outline" className="text-slate-400 text-xs py-0 px-1">
                      GPA: {student.gpa.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="text-slate-400 text-xs py-0 px-1">
                      Att: {student.attendance}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        subjects={supabaseSubjects}
        exams={supabaseExams}
      />
    </>
  );
}