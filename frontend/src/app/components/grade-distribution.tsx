import { useMemo } from "react";
import { useStudents } from "../context/StudentContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function GradeDistribution() {
  const { students, loading } = useStudents();

  const gradeData = useMemo(() => {
    if (students.length === 0) return [];

    // Map GPA to letter grades
    const getLetterGrade = (gpa: number): string => {
      if (gpa >= 3.7) return 'A';
      if (gpa >= 3.3) return 'B';
      if (gpa >= 3.0) return 'C';
      if (gpa >= 2.0) return 'D';
      return 'F';
    };

    const gradeCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 };

    students.forEach((student) => {
      const grade = getLetterGrade(student.gpa);
      gradeCounts[grade]++;
    });

    return [
      { grade: 'A', count: gradeCounts.A, color: '#10b981' },
      { grade: 'B', count: gradeCounts.B, color: '#3b82f6' },
      { grade: 'C', count: gradeCounts.C, color: '#8b5cf6' },
      { grade: 'D', count: gradeCounts.D, color: '#f59e0b' },
      { grade: 'F', count: gradeCounts.F, color: '#ef4444' },
    ];
  }, [students]);

  if (loading) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Current semester grade breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 text-slate-400">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gradeData.every((d) => d.count === 0)) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Current semester grade breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-80 text-slate-400">
            <p className="text-lg">No student data available</p>
            <p className="text-sm mt-2">Add students to view grade distribution</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
        <CardDescription>Current semester grade breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gradeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="grade" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" name="Students" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
