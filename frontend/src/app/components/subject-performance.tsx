import { useMemo } from "react";
import { useStudents } from "../context/StudentContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

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

export function SubjectPerformance({ exams = [] }: { exams?: Exam[] }) {
  const { loading, studentDatabase } = useStudents();

  // Pie chart data: aggregate subject scores from exams
  const chartData = useMemo(() => {
    const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    const subjectNames = ['Python', 'OS', 'DSA', 'M3', 'DELD'];
    
    if (!exams || exams.length === 0) return [];

    // Calculate average for each subject
    const rawData = subjectNames.map((subject, idx) => {
      const subjectExams = exams.filter(exam => 
        exam.name.toLowerCase().includes(subject.toLowerCase())
      );
      
      if (subjectExams.length === 0) return null;
      
      const scores = subjectExams
        .map(exam => (exam.ct1_score || 0) + (exam.ct2_score || 0))
        .filter(score => score > 0);
      
      if (scores.length === 0) return null;
      
      const average = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100) / 100;
      
      return {
        name: subject,
        rawValue: average,
        color: colors[idx % colors.length],
      };
    }).filter(Boolean) as Array<{ name: string; rawValue: number; color: string }>;

    // Calculate total and convert to percentages
    const total = rawData.reduce((sum, item) => sum + item.rawValue, 0);
    if (total === 0) return [];

    const data = rawData.map(item => ({
      ...item,
      value: Math.round((item.rawValue / total) * 10000) / 100, // percentage with 2 decimals
    })).sort((a, b) => b.value - a.value); // Sort by highest percentage first

    return data;
  }, [exams]);

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
            <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}