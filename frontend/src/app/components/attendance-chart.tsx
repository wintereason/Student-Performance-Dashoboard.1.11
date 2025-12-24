import { useMemo } from "react";
import { useStudents } from "../context/StudentContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function AttendanceChart() {
  const { students, loading } = useStudents();

  const attendanceData = useMemo(() => {
    if (students.length === 0) return [];

    const present = students.filter((s: any) => s.attendance >= 90).length;
    const absent = students.filter((s: any) => s.attendance < 50).length;
    const late = students.filter((s: any) => s.attendance >= 50 && s.attendance < 75).length;
    const excused = students.filter((s: any) => s.attendance >= 75 && s.attendance < 90).length;

    return [
      { name: "Present", value: present, color: "#22c55e" },
      { name: "Absent", value: absent, color: "#ef4444" },
      { name: "Late", value: late, color: "#f59e0b" },
      { name: "Excused", value: excused, color: "#3b82f6" },
    ].filter(item => item.value > 0);
  }, [students]);

  const total = attendanceData.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Total Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-slate-400">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (attendanceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Total Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
            <p className="text-lg">No attendance data available</p>
            <p className="text-sm mt-2">Add students to view attendance breakdown</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {attendanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-slate-400">
            Total Records: <span className="font-semibold text-slate-100">{total}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
