# Model Setup Quick Reference Guide

## Quick Start

### 1. Get All Students

```typescript
import { useStudents } from "@/context/StudentContext";
import { StudentService } from "@/services";

function MyComponent() {
  const { students, loading } = useStudents();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {students.map(student => (
        <div key={student.id}>{student.name}</div>
      ))}
    </div>
  );
}
```

### 2. Get Top Students

```typescript
const topStudents = StudentService.getTopStudents(students, 'gpa', 5);
// Returns top 5 students by GPA

const topByAttendance = StudentService.getTopStudents(students, 'attendance', 5);
const topByActivity = StudentService.getTopStudents(students, 'activity', 5);
```

### 3. Get Statistics

```typescript
const stats = StudentService.calculateStats(students);

console.log(stats.totalStudents);      // 62
console.log(stats.averageScore);       // 3.45
console.log(stats.attendanceRate);     // 94.5
console.log(stats.honorRoll);          // 18
console.log(stats.atRiskCount);        // 3
```

### 4. Get Student Rankings

```typescript
const student = StudentService.getStudentWithRankings(3, students);

console.log(student.gpaRank);          // 5 (5th highest GPA)
console.log(student.attendanceRank);   // 2 (2nd highest attendance)
console.log(student.activityRank);     // 8 (8th highest activity)
```

### 5. Search Students

```typescript
const results = StudentService.searchStudents("John", students);
// Searches name and department fields
```

### 6. Filter by Department

```typescript
const csStudents = StudentService.getStudentsByDepartment('CS', students);
```

### 7. Get All Departments

```typescript
const departments = StudentService.getDepartments(students);
// Returns: ['CS', 'Math', 'Physics', 'Chemistry', 'Biology']
```

### 8. Get At-Risk Students

```typescript
const atRisk = StudentService.getAtRiskStudents(students);
// Returns students with GPA < 2.5
```

### 9. Get Honor Roll Students

```typescript
const honorRoll = StudentService.getHonorRollStudents(students);
// Returns students with GPA >= 3.7
```

### 10. Sort Students

```typescript
const sorted = StudentService.sortStudents(students, 'gpa', 'desc');
// Sort by GPA descending

const ascending = StudentService.sortStudents(students, 'name', 'asc');
// Sort by name ascending
```

### 11. Get Distribution Data

```typescript
const gpaDistribution = StudentService.getGPADistribution(students);
// Returns: [
//   { range: '3.7 - 4.0', count: 15 },
//   { range: '3.3 - 3.6', count: 20 },
//   ...
// ]

const deptDistribution = StudentService.getDepartmentDistribution(students);
// Returns: [
//   { department: 'CS', count: 15 },
//   { department: 'Math', count: 12 },
//   ...
// ]
```

### 12. Group Students by Department

```typescript
const grouped = StudentService.getStudentsGroupedByDepartment(students);
// Returns: {
//   'CS': [student1, student2, ...],
//   'Math': [student3, student4, ...],
//   ...
// }
```

## File Structure

```
frontend/src/app/
├── models/
│   ├── Student.ts          # Data interfaces and StudentModel class
│   └── index.ts            # Exports
├── services/
│   ├── StudentService.ts   # API and business logic
│   └── index.ts            # Exports
├── context/
│   └── StudentContext.tsx  # Global state management
└── components/
    └── *.tsx               # React components
```

## Types

### Student
```typescript
{
  id: number;
  name: string;
  department: string;
  gpa: number;           // 0-4.0
  attendance: number;    // 0-100
  activityScore: number; // 0-100
}
```

### StudentStats
```typescript
{
  totalStudents: number;
  averageScore: number;      // Average GPA
  attendanceRate: number;    // Average attendance %
  honorRoll: number;         // Count with GPA >= 3.7
  atRiskCount: number;       // Count with GPA < 2.5
}
```

## Common Patterns

### Pattern 1: Display Top 5 with Rankings

```typescript
const topStudents = StudentService.getTopStudents(students, 'gpa', 5);

{topStudents.map((student, index) => {
  const ranking = StudentService.getStudentWithRankings(student.id, students);
  return (
    <div key={student.id}>
      <span>#{index + 1}</span>
      <span>{student.name}</span>
      <span>GPA: {student.gpa}</span>
      <span>Rank: {ranking.gpaRank}</span>
    </div>
  );
})}
```

### Pattern 2: Department Analytics

```typescript
const departments = StudentService.getDepartments(students);

{departments.map(dept => {
  const deptStats = StudentService.getStatsByDepartment(dept, students);
  return (
    <div key={dept}>
      <h3>{dept}</h3>
      <p>Students: {deptStats.totalStudents}</p>
      <p>Avg GPA: {deptStats.averageScore.toFixed(2)}</p>
    </div>
  );
})}
```

### Pattern 3: Search and Filter

```typescript
const [query, setQuery] = useState('');

const filtered = query
  ? StudentService.searchStudents(query, students)
  : students;

{filtered.map(student => (
  <div key={student.id}>{student.name}</div>
))}
```

### Pattern 4: Dashboard Stats

```typescript
const stats = StudentService.calculateStats(students);

<div className="stats">
  <StatCard label="Total" value={stats.totalStudents} />
  <StatCard label="Avg GPA" value={stats.averageScore.toFixed(2)} />
  <StatCard label="Attendance" value={stats.attendanceRate.toFixed(1)} />
  <StatCard label="Honor Roll" value={stats.honorRoll} />
  <StatCard label="At Risk" value={stats.atRiskCount} />
</div>
```

## API Reference Summary

### StudentService Methods

| Method | Returns | Purpose |
|--------|---------|---------|
| `getAllStudents()` | Promise<Student[]> | Fetch all students |
| `getStudentById(id)` | Promise<Student \| null> | Fetch single student |
| `getTopStudents(students, metric, count)` | Student[] | Get top N by metric |
| `getAtRiskStudents(students)` | Student[] | Get students with GPA < 2.5 |
| `getHonorRollStudents(students)` | Student[] | Get students with GPA >= 3.7 |
| `searchStudents(query, students)` | Student[] | Search by name/dept |
| `getStudentsByDepartment(dept, students)` | Student[] | Filter by department |
| `getDepartments(students)` | string[] | Get all departments |
| `calculateStats(students)` | StudentStats | Get aggregate stats |
| `getStatsByDepartment(dept, students)` | StudentStats | Get dept stats |
| `getStudentWithRankings(id, students)` | Student & rankings | Get student + ranks |
| `sortStudents(students, field, order)` | Student[] | Sort by field |
| `getGPADistribution(students)` | Distribution[] | Get GPA histogram |
| `getDepartmentDistribution(students)` | Distribution[] | Get dept histogram |
| `getStudentsGroupedByDepartment(students)` | Object | Group by dept |

## Data Flow

```
API Response → StudentService.normalizeStudent() → Student interface
    ↓
StudentProvider stores in state
    ↓
useStudents() hook accesses state
    ↓
Components use StudentService methods to process data
    ↓
Display on UI
```

## Error Handling

All StudentService methods include try-catch blocks and return safe defaults:
- `getAllStudents()` returns `[]` on error
- `getStudentById()` returns `null` on error
- StudentProvider sets `loading = false` on error

## Performance Tips

1. **Memoize computations** in components using `useMemo()`
2. **Use useCallback** for event handlers
3. **Avoid re-filtering** same data - cache results
4. **Use React.memo** for expensive components

Example:
```typescript
const memoizedStats = useMemo(
  () => StudentService.calculateStats(students),
  [students]
);
```

## Next Steps

1. Explore [MODEL_SETUP.md](../MODEL_SETUP.md) for detailed documentation
2. Check existing components for usage examples
3. Add new Student fields by updating Student interface
4. Create new StudentService methods as needed
5. Test with console.log() before using in components

## Troubleshooting

### Student data not loading?
- Check browser console for fetch errors
- Verify `/api/students` endpoint is working
- Ensure StudentProvider wraps your component tree

### Type errors?
- Import types from `@/models`
- Use `Student` interface for type safety
- Check method signatures in StudentService

### Data is stale?
- Call `refreshStudents()` from useStudents()
- Ensure useEffect dependencies are correct
- Check that StudentProvider is fetching on mount

---

**Last Updated:** December 2024
**Model Version:** 1.0
