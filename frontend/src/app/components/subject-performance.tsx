import { useMemo } from "react";
import { useStudents } from "../context/StudentContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from "recharts";

export function SubjectPerformance() {
  const { loading, studentDatabase } = useStudents();

  // Pie chart data: aggregate subject scores from studentDatabase
  const chartData = useMemo(() => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];
    if (!studentDatabase || studentDatabase.length === 0) return [];

    // Aggregate all subjects across all students
    const subjectMap: Record<string, { total: number; count: number }> = {};
    studentDatabase.forEach((student) => {
      student.subjects.forEach((subject) => {
        if (!subjectMap[subject.name]) {
          subjectMap[subject.name] = { total: 0, count: 0 };
        }
        subjectMap[subject.name].total += subject.percentage;
        subjectMap[subject.name].count += 1;
      });
    });

    // Only show subjects that have at least one score
    const data = Object.entries(subjectMap).map(([name, { total, count }], idx) => ({
      name,
      value: Math.round((total / count) * 100) / 100, // average percentage
      color: colors[idx % colors.length],
    }));
    return data;
  }, [studentDatabase]);

  if (loading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Average scores by subject (from Subject Scores Table)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-slate-400">Loading data...</div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
          <CardDescription>Average scores by subject (from Subject Scores Table)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-80 text-slate-400">
            <p className="text-lg">No subject data available</p>
            <p className="text-sm mt-2">Add subjects and scores to view chart</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Subject Performance</CardTitle>
        <CardDescription>Average scores by subject (from Subject Scores Table)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart margin={{ top: 20, right: 100, bottom: 20, left: 100 }}>
            <Pie
              data={chartData}
              cx="45%"
              cy="50%"
              labelLine={true}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={75}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}