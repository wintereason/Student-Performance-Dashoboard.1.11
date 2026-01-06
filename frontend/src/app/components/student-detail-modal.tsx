import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { User, BarChart3, BookOpen, Activity } from "lucide-react";
import { StudentModel } from "../models";

interface Student {
  id: number;
  name: string;
  department: string;
  gpa: number;
  attendance: number;
  activityScore: number;
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

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  subjects?: Subject[];
  exams?: Exam[];
}

export function StudentDetailModal({ student, isOpen, onClose, subjects = [], exams = [] }: StudentDetailModalProps) {
  if (!student) return null;

  const overallPerformance = StudentModel.calculateOverallPerformance(student);

  // Calculate exam marks for this student
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
    return {
      subject,
      exam,
      ct1,
      ct2
    };
  });

  const getGPALabel = (gpa: number) => {
    if (gpa >= 3.7) return "Excellent";
    if (gpa >= 3.3) return "Very Good";
    if (gpa >= 3.0) return "Good";
    if (gpa >= 2.5) return "Satisfactory";
    return "Needs Work";
  };

  const getGPABadgeColor = (gpa: number) => {
    if (gpa >= 3.7) return "bg-green-500/20 text-green-400";
    if (gpa >= 3.3) return "bg-emerald-500/20 text-emerald-400";
    if (gpa >= 3.0) return "bg-blue-500/20 text-blue-400";
    if (gpa >= 2.5) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  const getAttendanceLabel = (att: number) => {
    if (att >= 95) return "Perfect";
    if (att >= 90) return "Excellent";
    if (att >= 80) return "Good";
    if (att >= 70) return "Fair";
    return "Poor";
  };

  const getAttendanceBadgeColor = (att: number) => {
    if (att >= 95) return "bg-green-500/20 text-green-400";
    if (att >= 90) return "bg-emerald-500/20 text-emerald-400";
    if (att >= 80) return "bg-blue-500/20 text-blue-400";
    if (att >= 70) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  const getActivityLabel = (score: number) => {
    if (score >= 85) return "Outstanding";
    if (score >= 75) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Work";
  };

  const getActivityBadgeColor = (score: number) => {
    if (score >= 85) return "bg-green-500/20 text-green-400";
    if (score >= 75) return "bg-emerald-500/20 text-emerald-400";
    if (score >= 60) return "bg-blue-500/20 text-blue-400";
    if (score >= 40) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  const getOverallStatus = (overall: number) => {
    if (overall >= 90) return "Excellent Standing";
    if (overall >= 80) return "Good Standing";
    if (overall >= 70) return "Satisfactory";
    return "Needs Support";
  };

  const getOverallColor = (overall: number) => {
    if (overall >= 90) return "bg-green-500/20 text-green-400";
    if (overall >= 80) return "bg-emerald-500/20 text-emerald-400";
    if (overall >= 70) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 w-screen max-w-sm max-h-screen overflow-y-auto">
        {/* Compact Header */}
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-sm text-slate-100 truncate">{student.name}</DialogTitle>
                <p className="text-xs text-slate-400">{student.department} #{student.id}</p>
              </div>
            </div>
            <div className="bg-slate-700/50 rounded px-2 py-1 border border-slate-600 text-right flex-shrink-0">
              <p className="text-xs text-slate-100 font-bold">{overallPerformance.toFixed(1)}%</p>
              <Badge className={`${getOverallColor(overallPerformance)} text-xs mt-1`}>
                {getOverallStatus(overallPerformance).split(" ")[0]}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Three Main Metrics in Row */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {/* GPA Card */}
          <div className="parallelogram-card">
            <div className="parallelogram-content">
              <div className="flex items-center gap-1 mb-1 justify-center">
                <BarChart3 className="w-3 h-3 text-blue-400" />
                <p className="text-xs text-slate-300 font-semibold">GPA</p>
              </div>
              <p className="text-base font-bold text-slate-100">{student.gpa.toFixed(2)}</p>
              <p className="text-xs text-slate-500">/ 4.0</p>
              <Badge className={`${getGPABadgeColor(student.gpa)} text-xs w-full justify-center py-0.5 mt-1`}>
                {getGPALabel(student.gpa)}
              </Badge>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="parallelogram-card">
            <div className="parallelogram-content">
              <div className="flex items-center gap-1 mb-1 justify-center">
                <BookOpen className="w-3 h-3 text-purple-400" />
                <p className="text-xs text-slate-300 font-semibold">Attend</p>
              </div>
              <p className="text-base font-bold text-slate-100">{student.attendance}%</p>
              <p className="text-xs text-slate-500">-</p>
              <Badge className={`${getAttendanceBadgeColor(student.attendance)} text-xs w-full justify-center py-0.5 mt-1`}>
                {getAttendanceLabel(student.attendance)}
              </Badge>
            </div>
          </div>

          {/* Activity Score Card */}
          <div className="parallelogram-card">
            <div className="parallelogram-content">
              <div className="flex items-center gap-1 mb-1 justify-center">
                <Activity className="w-3 h-3 text-green-400" />
                <p className="text-xs text-slate-300 font-semibold">Act</p>
              </div>
              <p className="text-base font-bold text-slate-100">{student.activityScore}</p>
              <p className="text-xs text-slate-500">/ 100</p>
              <Badge className={`${getActivityBadgeColor(student.activityScore)} text-xs w-full justify-center py-0.5 mt-1`}>
                {getActivityLabel(student.activityScore)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Status Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* Risk Level */}
          <div className="bg-slate-700/30 rounded-lg p-2 border border-slate-600/30">
            <p className="text-xs text-slate-400 uppercase mb-1">Risk</p>
            <Badge className={`${
              student.gpa < 2.5 ? "bg-red-500/20 text-red-400" :
              student.gpa < 3.0 ? "bg-yellow-500/20 text-yellow-400" :
              "bg-green-500/20 text-green-400"
            } text-xs w-full justify-center`}>
              {student.gpa < 2.5 ? "At Risk" : student.gpa < 3.0 ? "Monitor" : "On Track"}
            </Badge>
          </div>

          {/* Engagement */}
          <div className="bg-slate-700/30 rounded-lg p-2 border border-slate-600/30">
            <p className="text-xs text-slate-400 uppercase mb-1">Engagement</p>
            <Badge className={`${
              student.activityScore >= 75 ? "bg-green-500/20 text-green-400" :
              student.activityScore >= 60 ? "bg-blue-500/20 text-blue-400" :
              "bg-orange-500/20 text-orange-400"
            } text-xs w-full justify-center`}>
              {student.activityScore >= 75 ? "High" : student.activityScore >= 60 ? "Moderate" : "Low"}
            </Badge>
          </div>

          {/* Academic Standing */}
          <div className="bg-slate-700/30 rounded-lg p-2 border border-slate-600/30">
            <p className="text-xs text-slate-400 uppercase mb-1">Academic</p>
            <Badge className={`${
              student.gpa >= 3.7 ? "bg-green-500/20 text-green-400" :
              "bg-blue-500/20 text-blue-400"
            } text-xs w-full justify-center`}>
              {student.gpa >= 3.7 ? "Honor" : "Good"}
            </Badge>
          </div>

          {/* Attendance Rate */}
          <div className="bg-slate-700/30 rounded-lg p-2 border border-slate-600/30">
            <p className="text-xs text-slate-400 uppercase mb-1">Attend Rate</p>
            <p className="text-sm font-bold text-slate-100 text-center">{student.attendance}%</p>
          </div>
        </div>

        {/* Details Grid - Compact */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-700/20 rounded-lg p-2 border border-slate-600/30">
            <p className="text-xs text-slate-400 uppercase">ID</p>
            <p className="text-sm font-bold text-slate-100">#{student.id}</p>
          </div>
          <div className="bg-slate-700/20 rounded-lg p-2 border border-slate-600/30">
            <p className="text-xs text-slate-400 uppercase">Dept</p>
            <p className="text-sm font-bold text-slate-100">{student.department}</p>
          </div>
        </div>

        {/* Exam Marks Section */}
        {studentExams.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Exam Marks
            </h3>
            <div className="space-y-2">
              {studentExams.map((item) => (
                <div key={item.subject.id} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{item.subject.name}</p>
                      <p className="text-xs text-slate-400">{item.subject.code} • {item.subject.instructor}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-900/20 rounded px-2 py-1.5 border border-blue-700/30">
                      <p className="text-xs text-slate-400 uppercase">CT1</p>
                      <p className="text-lg font-bold text-blue-400">{item.ct1 || '-'}</p>
                    </div>
                    <div className="bg-purple-900/20 rounded px-2 py-1.5 border border-purple-700/30">
                      <p className="text-xs text-slate-400 uppercase">CT2</p>
                      <p className="text-lg font-bold text-purple-400">{item.ct2 || '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Total Marks */}
              <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50 mt-3">
                <p className="text-xs text-slate-400 uppercase mb-2 font-semibold">Total Marks</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-900/30 rounded px-2 py-2 text-center">
                    <p className="text-xs text-slate-400">CT1 Total</p>
                    <p className="text-xl font-bold text-blue-400">{ct1Total || '-'}</p>
                  </div>
                  <div className="bg-purple-900/30 rounded px-2 py-2 text-center">
                    <p className="text-xs text-slate-400">CT2 Total</p>
                    <p className="text-xl font-bold text-purple-400">{ct2Total || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
