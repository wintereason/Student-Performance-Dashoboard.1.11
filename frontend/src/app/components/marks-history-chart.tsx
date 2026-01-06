import { useMemo } from "react";
import { useStudents } from "../context/StudentContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function MarksHistoryChart({ exams = [] }: { exams?: any[] }) {
  const { students, loading } = useStudents();

  const marksData = useMemo(() => {
    if (students.length === 0 || exams.length === 0) return [];

    const subjectNames = ['Python', 'OS', 'DSA', 'M3', 'DELD'];
    const chartData = [];

    subjectNames.forEach((subject) => {
      // Filter exams for this subject
      const subjectExams = exams.filter(exam => 
        exam.name.toLowerCase().includes(subject.toLowerCase())
      );

      if (subjectExams.length === 0) return;

      // Separate CT1 and CT2
      const ct1Exams = subjectExams.filter(e => 
        e.name.toLowerCase().includes('ct-1') || e.name.toLowerCase().includes('ct1')
      );
      const ct2Exams = subjectExams.filter(e => 
        e.name.toLowerCase().includes('ct-2') || e.name.toLowerCase().includes('ct2')
      );

      // Calculate CT1 average and passing percentage (pass = score >= 25, out of 50)
      let ct1Scores = ct1Exams.map(e => e.ct1_score || 0).filter(s => s > 0);
      let ct1Average = ct1Scores.length > 0 ? ct1Scores.reduce((a, b) => a + b, 0) / ct1Scores.length : 0;
      let ct1PassingCount = ct1Scores.filter(s => s >= 25).length;
      let ct1PassingPercentage = ct1Scores.length > 0 ? Math.round((ct1PassingCount / ct1Scores.length) * 100) : 0;

      // Calculate CT2 average and passing percentage
      let ct2Scores = ct2Exams.map(e => e.ct2_score || 0).filter(s => s > 0);
      let ct2Average = ct2Scores.length > 0 ? ct2Scores.reduce((a, b) => a + b, 0) / ct2Scores.length : 0;
      let ct2PassingCount = ct2Scores.filter(s => s >= 25).length;
      let ct2PassingPercentage = ct2Scores.length > 0 ? Math.round((ct2PassingCount / ct2Scores.length) * 100) : 0;

      chartData.push({
        subject,
        'CT-1 Avg': Math.round(ct1Average * 100) / 100,
        'CT-2 Avg': Math.round(ct2Average * 100) / 100,
        'CT-1 Pass %': ct1PassingPercentage,
        'CT-2 Pass %': ct2PassingPercentage,
      });
    });

    return chartData;
  }, [exams]);

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
            <p className="text-sm mt-2">Add exam data to view subject averages and passing percentages</p>
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
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marksData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="subject" 
                stroke="#94a3b8"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                stroke="#94a3b8"
                label={{ value: 'Score / Percentage', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value) => `${value}`}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              />
              <Legend />
              <Bar dataKey="CT-1 Avg" fill="#3b82f6" name="CT-1 Average Score" />
              <Bar dataKey="CT-2 Avg" fill="#8b5cf6" name="CT-2 Average Score" />
              <Bar dataKey="CT-1 Pass %" fill="#10b981" name="CT-1 Passing %" />
              <Bar dataKey="CT-2 Pass %" fill="#f59e0b" name="CT-2 Passing %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
