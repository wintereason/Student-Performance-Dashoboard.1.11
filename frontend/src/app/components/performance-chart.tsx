import { useMemo } from "react";
import { useStudents } from "../context/StudentContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function PerformanceChart() {
  const { students, loading } = useStudents();

  const examStatusData = useMemo(() => {
    if (students.length === 0) return [];

    // Calculate pass/fail based on GPA threshold
    const passingGPA = 2.0;
    const pass = students.filter((s) => s.gpa >= passingGPA).length;
    const fail = students.filter((s) => s.gpa < passingGPA).length;

    return [
      { name: 'Pass', value: pass, color: '#10b981' },
      { name: 'Fail', value: fail, color: '#ef4444' },
      { name: "Didn't Take Exam", value: 0, color: '#94a3b8' },
    ].filter((item) => item.value > 0);
  }, [students]);

  if (loading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Exam Status Overview</CardTitle>
          <CardDescription>Distribution of students by exam performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 text-slate-400">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (examStatusData.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Exam Status Overview</CardTitle>
          <CardDescription>Distribution of students by exam performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-80 text-slate-400">
            <p className="text-lg">No student data available</p>
            <p className="text-sm mt-2">Add students to view exam status</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Exam Status Overview</CardTitle>
        <CardDescription>Distribution of students by exam performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={examStatusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {examStatusData.map((entry, index) => (
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