import { useState, useEffect } from "react";
import { StudentProvider, useStudents } from "./context/StudentContext";
import { StudentService } from "./services";
import { StudentDetailModal } from "./components/student-detail-modal";
import { Sidebar } from "./components/sidebar";
import { StatsCard } from "./components/stats-card";
import { PerformanceChart } from "./components/performance-chart";
import { GradeDistribution } from "./components/grade-distribution";
import { TopStudents } from "./components/top-students";
import { SubjectPerformance } from "./components/subject-performance";
import { RecentActivity } from "./components/recent-activity";
import { AtRiskStudents } from "./components/at-risk-students";
import { AttendanceChart } from "./components/attendance-chart";
import { MarksHistoryChart } from "./components/marks-history-chart";
import { StudentSearch } from "./components/student-search";
import { ManagementBoard } from "./components/management-board";
import { SubjectScoresTable } from "./components/subject-scores-table";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  Award,
  Calendar,
  BarChart3,
  PieChart,
  Settings,
  Trophy
} from "lucide-react";

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [overviewPage, setOverviewPage] = useState(1);
  const [managementPage, setManagementPage] = useState(1);
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageScore: 0,
    attendanceRate: 0,
    honorRoll: 0,
    atRiskCount: 0
  });
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const { students, loading } = useStudents();

  useEffect(() => {
    if (students.length > 0) {
      calculateStats(students);
    }
  }, [students]);

  const calculateStats = (studentsData: any[]) => {
    console.log(`Calculating stats for ${studentsData.length} students`);
    const calculatedStats = StudentService.calculateStats(studentsData);
    setStats(calculatedStats);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Content Area */}
      <div className="lg:pl-64 pl-20 transition-all duration-300">
        {/* Header */}
        <header className="border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900 shadow-xl">
          <div className="px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-100 drop-shadow-lg">
                  {currentPage === 'dashboard' && 'Student Performance Dashboard'}
                  {currentPage === 'overview' && 'Overview Board'}
                  {currentPage === 'performance' && 'Performance Board'}
                  {currentPage === 'students' && 'Students Details'}
                  {currentPage === 'management' && 'Management Detail'}
                </h1>
                <p className="text-slate-300 mt-1">Academic Year 2024-2025</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-300" />
                <span className="text-sm text-slate-300">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 py-8">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-slate-300 mt-4">Loading student data...</p>
              </div>
            </div>
          )}
          
          {!loading && currentPage === 'dashboard' && (
            <>
              {/* Stats Overview */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatsCard
                  title="Total Students"
                  value={stats.totalStudents}
                  icon={Users}
                  trend={{ value: 100, isPositive: true }}
                  subtitle="Active this semester"
                />
                <StatsCard
                  title="Average GPA"
                  value={`${stats.averageScore.toFixed(2)}`}
                  icon={TrendingUp}
                  trend={{ value: 3.1, isPositive: true }}
                  subtitle="Across all students"
                />
                <StatsCard
                  title="Attendance Rate"
                  value={`${stats.attendanceRate.toFixed(1)}%`}
                  icon={BookOpen}
                  trend={{ value: 1.8, isPositive: true }}
                  subtitle="Average attendance"
                />
                <StatsCard
                  title="Honor Roll"
                  value={stats.honorRoll}
                  icon={Award}
                  trend={{ value: stats.atRiskCount, isPositive: false }}
                  subtitle={`${stats.atRiskCount} at risk`}
                />
              </div>

              {/* Charts Section */}
              <div className="grid gap-6 lg:grid-cols-3 mb-8">
                <PerformanceChart />
                <GradeDistribution />
              </div>

              {/* Performance Breakdown */}
              <div className="grid gap-6 lg:grid-cols-3 mb-8">
                <SubjectPerformance />
                <TopStudents />
              </div>

              {/* Recent Activity */}
              <RecentActivity />
            </>
          )}

          {currentPage === 'overview' && (
            <div className="space-y-6">
              {/* Page Navigation */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setOverviewPage(1)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    overviewPage === 1
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Page 1: Academic Leaders
                </button>
                <button
                  onClick={() => setOverviewPage(2)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    overviewPage === 2
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Page 2: Activity Champions
                </button>
              </div>

              {/* Page 1: Top Scorers & Attendance */}
              {overviewPage === 1 && (
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Top 5 Scorers */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-400" />
                        Top 5 Scorer Students
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {students
                          .sort((a: any, b: any) => parseFloat(b.gpa) - parseFloat(a.gpa))
                          .slice(0, 5)
                          .map((student: any, index: number) => (
                            <div 
                              key={student.id} 
                              className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                                index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                index === 1 ? 'bg-gray-400/20 text-gray-300' :
                                index === 2 ? 'bg-orange-500/20 text-orange-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                #{index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-100">{student.name}</p>
                                <p className="text-sm text-slate-400">{student.department}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-slate-100">{parseFloat(student.gpa).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top 5 Attendance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-400" />
                        Top 5 Attendance Students
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {students
                          .sort((a: any, b: any) => parseInt(b.attendance) - parseInt(a.attendance))
                          .slice(0, 5)
                          .map((student: any, index: number) => (
                            <div 
                              key={student.id} 
                              className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                                index === 0 ? 'bg-green-500/20 text-green-400' :
                                index === 1 ? 'bg-emerald-500/20 text-emerald-400' :
                                index === 2 ? 'bg-teal-500/20 text-teal-400' :
                                'bg-cyan-500/20 text-cyan-400'
                              }`}>
                                #{index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-100">{student.name}</p>
                                <p className="text-sm text-slate-400">{student.department}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-400">{student.attendance}%</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Page 2: Activity Participants & Overall Performance */}
              {overviewPage === 2 && (
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Top 5 Activity Participants */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-purple-400" />
                        Top 5 Activity Champions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {students
                          .sort((a: any, b: any) => parseInt(b.activityScore) - parseInt(a.activityScore))
                          .slice(0, 5)
                          .map((student: any, index: number) => (
                            <div 
                              key={student.id} 
                              className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedStudent(student);
                                setIsDetailModalOpen(true);
                              }}
                            >
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                                index === 0 ? 'bg-purple-500/20 text-purple-400' :
                                index === 1 ? 'bg-pink-500/20 text-pink-400' :
                                index === 2 ? 'bg-rose-500/20 text-rose-400' :
                                'bg-violet-500/20 text-violet-400'
                              }`}>
                                #{index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-100">{student.name}</p>
                                <p className="text-sm text-slate-400">{student.department}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-purple-400">{student.activityScore}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top 5 Overall Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        Top 5 Overall Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {students
                          .sort((a: any, b: any) => {
                            const scoreA = (parseFloat(a.gpa) + parseInt(a.attendance) + parseInt(a.activityScore)) / 3;
                            const scoreB = (parseFloat(b.gpa) + parseInt(b.attendance) + parseInt(b.activityScore)) / 3;
                            return scoreB - scoreA;
                          })
                          .slice(0, 5)
                          .map((student: any, index: number) => {
                            const overallScore = ((parseFloat(student.gpa) * 25) + parseInt(student.attendance) + parseInt(student.activityScore)) / 3;
                            return (
                              <div 
                                key={student.id} 
                                className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setIsDetailModalOpen(true);
                                }}
                              >
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                                  index === 0 ? 'bg-blue-500/20 text-blue-400' :
                                  index === 1 ? 'bg-indigo-500/20 text-indigo-400' :
                                  index === 2 ? 'bg-sky-500/20 text-sky-400' :
                                  'bg-cyan-500/20 text-cyan-400'
                                }`}>
                                  #{index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-slate-100">{student.name}</p>
                                  <div className="flex gap-2 mt-1 text-xs text-slate-400">
                                    <span>GPA: {parseFloat(student.gpa).toFixed(2)}</span>
                                    <span>•</span>
                                    <span>Activity: {student.activityScore}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-blue-400">{parseFloat(student.gpa).toFixed(2)}</p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {currentPage === 'performance' && (
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <AttendanceChart />
                <MarksHistoryChart />
              </div>
              <AtRiskStudents />
            </div>
          )}

          {currentPage === 'students' && (
            <StudentSearch />
          )}

          {currentPage === 'management' && (
            <div className="space-y-6">
              {/* Page Navigation */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setManagementPage(1)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    managementPage === 1
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Page 1: Student Management
                </button>
                <button
                  onClick={() => setManagementPage(2)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    managementPage === 2
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Page 2: Subject Scores
                </button>
              </div>

              {/* Page 1: Student Management */}
              {managementPage === 1 && (
                <ManagementBoard />
              )}

              {/* Page 2: Subject Scores */}
              {managementPage === 2 && (
                <SubjectScoresTable managedStudents={students} />
              )}
            </div>
          )}

          <StudentDetailModal 
            student={selectedStudent} 
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
          />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StudentProvider>
      <AppContent />
    </StudentProvider>
  );
}
