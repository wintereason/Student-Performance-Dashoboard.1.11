import { useState, useMemo, useEffect } from "react";
import { useStudents } from "../context/StudentContext";
import { StudentSupabaseService } from "../services/SupabaseService";
import { StudentModel, Student } from "../models";
import { StudentDetailModal } from "./student-detail-modal";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Award, Trophy, Medal } from "lucide-react";

const rankConfig = {
  1: { icon: Trophy, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  2: { icon: Medal, color: 'text-gray-600', bgColor: 'bg-gray-50' },
  3: { icon: Medal, color: 'text-orange-600', bgColor: 'bg-orange-50' },
};

export function RecentActivity() {
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

  const topScorers = useMemo(() => {
    if (students.length === 0) return [];

    const scoredStudents = students.map((student: any) => ({
      ...student,
      id: student.id,
      name: student.name,
      score: StudentModel.calculateOverallPerformance(student),
      subject: 'Overall',
      rank: 0, // Will be assigned after sorting
    }));

    return scoredStudents
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((student, index) => ({
        ...student,
        rank: index + 1,
      }));
  }, [students]);

  const handleStudentClick = (student: any) => {
    // Find the full student object from the students array
    const fullStudent = students.find(s => s.id === student.id);
    if (fullStudent) {
      setSelectedStudent(fullStudent);
      setIsDetailModalOpen(true);
    }
  };

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Top 5 Scorer Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-slate-400">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (topScorers.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Top 5 Scorer Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <p className="text-lg">No student data available</p>
            <p className="text-sm mt-2">Add students to view top performers</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Top 5 Scorer Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topScorers.map((student) => {
            const rankStyle = rankConfig[student.rank as keyof typeof rankConfig];
            const Icon = rankStyle?.icon || Award;
            const iconColor = rankStyle?.color || 'text-blue-400';
            const bgColor = rankStyle?.bgColor || 'bg-blue-500/20';
            
            return (
              <div 
                key={student.id} 
                onClick={() => handleStudentClick(student)}
                className="flex items-start gap-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
              >
                <div className={`rounded-full p-2 ${bgColor}`}>
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-100">{student.name}</p>
                    <Badge variant="outline" className="ml-2 border-slate-600 text-slate-300">
                      Rank #{student.rank}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>Score: {student.score.toFixed(1)}%</span>
                    <span>•</span>
                    <span>{student.subject} Performance</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>

    {selectedStudent && (
      <StudentDetailModal
        student={selectedStudent}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStudent(null);
        }}
        subjects={supabaseSubjects}
        exams={supabaseExams}
      />
    )}
    </>
  );
}