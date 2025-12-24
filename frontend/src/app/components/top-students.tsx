import { useState, useMemo } from "react";
import { useStudents } from "../context/StudentContext";
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
          <div className="space-y-3">
            {topStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-start gap-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4 hover:bg-slate-800/70 transition-colors cursor-pointer"
                onClick={() => {
                  setSelectedStudent(student);
                  setIsDetailModalOpen(true);
                }}
              >
                {/* Rank Icon */}
                <div className="rounded-full p-2 flex-shrink-0">
                  {student.icon}
                </div>

                {/* Student Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-100">{student.name}</p>
                    <Badge className="bg-slate-700 text-slate-200">
                      Rank #{student.rank}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>Score: {student.overallPerformance.toFixed(1)}%</span>
                    <span>•</span>
                    <span>Overall Performance</span>
                  </div>
                  
                  {/* Performance Breakdown */}
                  <div className="flex gap-2 mt-2 text-xs">
                    <Badge variant="outline" className="text-slate-300">
                      GPA: {student.gpa.toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="text-slate-300">
                      Att: {student.attendance}%
                    </Badge>
                    <Badge variant="outline" className="text-slate-300">
                      Act: {student.activityScore}
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
      />
    </>
  );
}