# Model Setup Examples - Common Components

## Example 1: Stats Dashboard

Shows overall student performance statistics using the model.

```typescript
// components/StatsDashboard.tsx
import { useStudents } from "@/context/StudentContext";
import { StudentService } from "@/services";
import { useMemo } from "react";

export function StatsDashboard() {
  const { students, loading } = useStudents();

  const stats = useMemo(
    () => StudentService.calculateStats(students),
    [students]
  );

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard 
        label="Total Students" 
        value={stats.totalStudents} 
      />
      <StatCard 
        label="Average GPA" 
        value={stats.averageScore.toFixed(2)} 
      />
      <StatCard 
        label="Avg Attendance" 
        value={`${stats.attendanceRate.toFixed(1)}%`} 
      />
      <StatCard 
        label="Honor Roll" 
        value={stats.honorRoll} 
      />
      <StatCard 
        label="At Risk" 
        value={stats.atRiskCount} 
        isAlert 
      />
    </div>
  );
}

function StatCard({ label, value, isAlert = false }) {
  return (
    <div className={`p-4 rounded-lg ${isAlert ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`text-2xl font-bold ${isAlert ? 'text-red-400' : 'text-blue-400'}`}>
        {value}
      </p>
    </div>
  );
}
```

## Example 2: Top Students List

Display top 5 students with rankings.

```typescript
// components/TopStudentsList.tsx
import { useStudents } from "@/context/StudentContext";
import { StudentService } from "@/services";
import { useMemo } from "react";
import { Award } from "lucide-react";

export function TopStudentsList() {
  const { students, loading } = useStudents();

  const topStudents = useMemo(
    () => StudentService.getTopStudents(students, 'gpa', 5),
    [students]
  );

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-slate-100">Top 5 Students</h2>
      </div>
      
      <div className="space-y-3">
        {topStudents.map((student, index) => (
          <div key={student.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <span className="text-yellow-400 font-bold">#{index + 1}</span>
              </div>
              <div>
                <p className="font-medium text-slate-100">{student.name}</p>
                <p className="text-sm text-slate-400">{student.department}</p>
              </div>
            </div>
            <p className="font-bold text-slate-100">{student.gpa.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Example 3: Student Search

Search and filter students by name or department.

```typescript
// components/StudentSearch.tsx
import { useStudents } from "@/context/StudentContext";
import { StudentService } from "@/services";
import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

export function StudentSearch() {
  const { students, loading } = useStudents();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return StudentService.searchStudents(query, students);
  }, [query, students]);

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or department..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {query && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No students found</p>
          ) : (
            results.map((student) => (
              <div
                key={student.id}
                className="p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 cursor-pointer"
              >
                <p className="font-medium text-slate-100">{student.name}</p>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{student.department}</span>
                  <span>GPA: {student.gpa.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
```

## Example 4: Department Statistics

Show statistics for each department.

```typescript
// components/DepartmentStats.tsx
import { useStudents } from "@/context/StudentContext";
import { StudentService } from "@/services";
import { useMemo } from "react";

export function DepartmentStats() {
  const { students, loading } = useStudents();

  const departments = useMemo(
    () => StudentService.getDepartments(students),
    [students]
  );

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-100">Department Overview</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => {
          const deptStats = StudentService.getStatsByDepartment(dept, students);
          return (
            <div
              key={dept}
              className="p-4 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              <h3 className="text-lg font-bold text-slate-100 mb-3">{dept}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Students:</span>
                  <span className="text-slate-200 font-medium">
                    {deptStats.totalStudents}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Avg GPA:</span>
                  <span className="text-slate-200 font-medium">
                    {deptStats.averageScore.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Attendance:</span>
                  <span className="text-slate-200 font-medium">
                    {deptStats.attendanceRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Honor Roll:</span>
                  <span className="text-green-400 font-medium">
                    {deptStats.honorRoll}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## Example 5: At-Risk Students Alert

Highlight students who need attention.

```typescript
// components/AtRiskAlert.tsx
import { useStudents } from "@/context/StudentContext";
import { StudentService } from "@/services";
import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";

export function AtRiskAlert() {
  const { students, loading } = useStudents();

  const atRiskStudents = useMemo(
    () => StudentService.getAtRiskStudents(students),
    [students]
  );

  if (loading) return null;

  if (atRiskStudents.length === 0) {
    return (
      <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
        <p className="text-green-400">✓ No at-risk students detected</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-5 w-5 text-red-400" />
        <h3 className="font-bold text-red-400">
          {atRiskStudents.length} Students at Risk
        </h3>
      </div>
      
      <div className="space-y-2">
        {atRiskStudents.map((student) => (
          <div
            key={student.id}
            className="flex justify-between items-center p-2 bg-red-500/5 rounded"
          >
            <div>
              <p className="text-red-300 font-medium">{student.name}</p>
              <p className="text-sm text-red-200/70">{student.department}</p>
            </div>
            <p className="font-bold text-red-400">GPA: {student.gpa.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Example 6: GPA Distribution Chart

Display GPA distribution histogram.

```typescript
// components/GPADistributionChart.tsx
import { useStudents } from "@/context/StudentContext";
import { StudentService } from "@/services";
import { useMemo } from "react";

export function GPADistributionChart() {
  const { students, loading } = useStudents();

  const distribution = useMemo(
    () => StudentService.getGPADistribution(students),
    [students]
  );

  if (loading) return <div className="p-4">Loading...</div>;

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <h2 className="text-xl font-bold text-slate-100 mb-6">GPA Distribution</h2>
      
      <div className="space-y-4">
        {distribution.map((item) => {
          const percentage = (item.count / maxCount) * 100;
          return (
            <div key={item.range}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">{item.range}</span>
                <span className="text-slate-200 font-medium">{item.count}</span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## Example 7: Student Detail Modal with Rankings

Show detailed student info with rankings.

```typescript
// components/StudentDetailView.tsx
import { useStudents } from "@/context/StudentContext";
import { StudentService } from "@/services";
import { useMemo } from "react";
import { Award, TrendingUp, Calendar } from "lucide-react";

interface Props {
  studentId: number;
}

export function StudentDetailView({ studentId }: Props) {
  const { students } = useStudents();

  const studentData = useMemo(() => {
    return StudentService.getStudentWithRankings(studentId, students);
  }, [studentId, students]);

  if (!studentData) {
    return <div className="p-4 text-center text-slate-400">Student not found</div>;
  }

  const totalStudents = students.length;

  return (
    <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-100">{studentData.name}</h2>
        <p className="text-slate-400">{studentData.department}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          icon={TrendingUp}
          label="GPA"
          value={studentData.gpa.toFixed(2)}
          rank={`${studentData.gpaRank}/${totalStudents}`}
          color="blue"
        />
        <MetricCard
          icon={Calendar}
          label="Attendance"
          value={`${studentData.attendance}%`}
          rank={`${studentData.attendanceRank}/${totalStudents}`}
          color="green"
        />
        <MetricCard
          icon={Award}
          label="Activity Score"
          value={studentData.activityScore}
          rank={`${studentData.activityRank}/${totalStudents}`}
          color="purple"
        />
      </div>

      <div className="p-4 bg-slate-700/30 rounded-lg">
        <h3 className="font-bold text-slate-100 mb-2">Rankings</h3>
        <ul className="space-y-1 text-sm text-slate-400">
          <li>• GPA Rank: #{studentData.gpaRank}</li>
          <li>• Attendance Rank: #{studentData.attendanceRank}</li>
          <li>• Activity Rank: #{studentData.activityRank}</li>
        </ul>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ className: string }>;
  label: string;
  value: string | number;
  rank: string;
  color: 'blue' | 'green' | 'purple';
}

function MetricCard({ icon: Icon, label, value, rank, color }: MetricCardProps) {
  const bgColor = {
    blue: 'bg-blue-500/10',
    green: 'bg-green-500/10',
    purple: 'bg-purple-500/10'
  }[color];

  const textColor = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400'
  }[color];

  return (
    <div className={`p-4 ${bgColor} rounded-lg border border-slate-700`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${textColor}`} />
        <p className="text-sm text-slate-400">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">Rank: {rank}</p>
    </div>
  );
}
```

## Example 8: Quick Actions

Common operations for dashboard.

```typescript
// components/QuickActions.tsx
import { useStudents } from "@/context/StudentContext";
import { StudentService } from "@/services";
import { useState } from "react";

export function QuickActions() {
  const { students, refreshStudents } = useStudents();
  const [action, setAction] = useState<string>("");

  const executeAction = async (type: string) => {
    setAction(type);
    
    if (type === "refresh") {
      await refreshStudents();
    } else if (type === "export-top-students") {
      const top = StudentService.getTopStudents(students, 'gpa', 10);
      console.log("Top 10 Students:", top);
      // Download as CSV or JSON
    } else if (type === "alert-at-risk") {
      const atRisk = StudentService.getAtRiskStudents(students);
      console.log(`Alert: ${atRisk.length} students at risk`);
      // Send notification
    }
    
    setAction("");
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => executeAction("refresh")}
        disabled={action === "refresh"}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {action === "refresh" ? "Refreshing..." : "Refresh Data"}
      </button>
      
      <button
        onClick={() => executeAction("export-top-students")}
        disabled={action === "export-top-students"}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Export Top Students
      </button>
      
      <button
        onClick={() => executeAction("alert-at-risk")}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Check At-Risk
      </button>
    </div>
  );
}
```

---

These examples demonstrate how to use the Student model setup in real components. Mix and match these patterns to build your dashboard!
