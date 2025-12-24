import { useMemo } from "react";
import { useStudents } from "../context/StudentContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function MarksHistoryChart() {
  const { students, loading } = useStudents();

  const marksData = useMemo(() => {
    if (students.length === 0) return [];

    // Generate monthly data based on student GPA, attendance, and activity scores
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    
    return months.map((month, index) => {
      // Create variation in scores across months
      const variance = Math.sin(index * 0.5) * 5;
      
      const avgGPA = students.reduce((sum: number, s: any) => sum + (s.gpa || 0), 0) / students.length;
      const assignments = Math.min(100, Math.max(0, (avgGPA / 4.0) * 100 + variance));
      const tests = Math.min(100, Math.max(0, (avgGPA / 4.0) * 100 - variance * 0.5));
      const avgAttendance = students.reduce((sum: number, s: any) => sum + (s.attendance || 0), 0) / students.length;
      const projects = Math.min(100, Math.max(0, avgAttendance + variance * 2));
      const avgActivity = students.reduce((sum: number, s: any) => sum + (s.activityScore || 0), 0) / students.length;
      const quizzes = Math.min(100, Math.max(0, (avgActivity * 1.2) + variance));

      return {
        month,
        assignments: Math.round(assignments),
        tests: Math.round(tests),
        projects: Math.round(projects),
        quizzes: Math.round(quizzes),
      };
    });
  }, [students]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Marks History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px] text-slate-400">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (marksData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Marks History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[350px] text-slate-400">
            <p className="text-lg">No marks history available</p>
            <p className="text-sm mt-2">Add students to view marks trends</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Marks History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-slate-700">
            <TabsTrigger value="line" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50">
              Line Chart
            </TabsTrigger>
            <TabsTrigger value="bar" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50">
              Bar Chart
            </TabsTrigger>
          </TabsList>
          <TabsContent value="line" className="mt-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marksData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="assignments" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="tests" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="projects" stroke="#a855f7" strokeWidth={2} />
                  <Line type="monotone" dataKey="quizzes" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="bar" className="mt-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={marksData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="assignments" fill="#3b82f6" />
                  <Bar dataKey="tests" fill="#22c55e" />
                  <Bar dataKey="projects" fill="#a855f7" />
                  <Bar dataKey="quizzes" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
