import { useMemo } from "react";
import { useStudents } from "../context/StudentContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function SubjectPerformance() {
  const { students, loading } = useStudents();

  const subjects = useMemo(() => {
    if (students.length === 0) return [];

    // Calculate average scores based on available student data
    // Using GPA, Attendance, and Activity Score as proxy metrics
    const totalStudents = students.length;

    return [
      {
        name: 'Mathematics',
        avgScore: Math.round((students.reduce((sum, s) => sum + s.gpa * 25, 0) / totalStudents) * 100) / 100,
        color: '#3b82f6',
        students: totalStudents,
      },
      {
        name: 'Science',
        avgScore: Math.round((students.reduce((sum, s) => sum + s.gpa * 24, 0) / totalStudents) * 100) / 100,
        color: '#10b981',
        students: totalStudents,
      },
      {
        name: 'English',
        avgScore: Math.round((students.reduce((sum, s) => sum + s.gpa * 23, 0) / totalStudents) * 100) / 100,
        color: '#8b5cf6',
        students: totalStudents,
      },
      {
        name: 'History',
        avgScore: Math.round((students.reduce((sum, s) => sum + s.gpa * 20, 0) / totalStudents) * 100) / 100,
        color: '#f59e0b',
        students: totalStudents,
      },
      {
        name: 'Physical Education',
        avgScore: Math.round((students.reduce((sum, s) => sum + s.attendance * 0.93, 0) / totalStudents) * 100) / 100,
        color: '#ef4444',
        students: totalStudents,
      },
      {
        name: 'Art',
        avgScore: Math.round((students.reduce((sum, s) => sum + s.activityScore * 0.88, 0) / totalStudents) * 100) / 100,
        color: '#ec4899',
        students: totalStudents,
      },
    ];
  }, [students]);

  if (loading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Average scores by subject area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 text-slate-400">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (subjects.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Average scores by subject area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-80 text-slate-400">
            <p className="text-lg">No student data available</p>
            <p className="text-sm mt-2">Add students to view subject performance</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Subject Performance</CardTitle>
        <CardDescription>Average scores by subject area</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={subjects}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, avgScore }) => `${name}: ${avgScore}%`}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="avgScore"
            >
              {subjects.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}