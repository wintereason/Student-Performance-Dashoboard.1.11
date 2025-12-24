# Student Performance Dashboard - Model Setup Documentation

## Overview

This document describes the model setup and architecture for the Student Performance Dashboard. The system uses a **three-tier architecture**: Models, Services, and Context for managing student data.

## Architecture

```
┌─────────────────────────────────────────────────┐
│         Components (UI Layer)                   │
│  - Dashboard, Charts, Cards, etc.               │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│      Context (State Management)                 │
│  - StudentProvider                              │
│  - useStudents hook                             │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│       Services (Business Logic)                 │
│  - StudentService                               │
│    • Data fetching                              │
│    • Calculations                               │
│    • Transformations                            │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│        Models (Data Structure)                  │
│  - Student interface                            │
│  - StudentStats interface                       │
│  - StudentModel (helper methods)                │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│         API Layer (Backend)                     │
│  - Flask API                                    │
│  - CSV Data Source                              │
└─────────────────────────────────────────────────┘
```

## 1. Models (`src/app/models/Student.ts`)

### Interfaces

#### Student
```typescript
interface Student {
  id: number;
  name: string;
  department: string;
  gpa: number;
  attendance: number;
  activityScore: number;
}
```

The core data structure representing a student with:
- **id**: Unique identifier
- **name**: Student full name
- **department**: Academic department (CS, Math, Physics, etc.)
- **gpa**: Grade Point Average (0-4.0 scale)
- **attendance**: Attendance percentage (0-100)
- **activityScore**: Participation score (0-100)

#### StudentStats
```typescript
interface StudentStats {
  totalStudents: number;
  averageScore: number;
  attendanceRate: number;
  honorRoll: number;
  atRiskCount: number;
}
```

Aggregated statistics calculated from student data.

#### ApiResponse<T>
```typescript
interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data?: T;
  error?: string;
}
```

Standard API response format.

### StudentModel Class

Helper class with static methods for student data operations:

#### Ranking Methods
```typescript
StudentModel.getGPARank(students, studentId)         // Get GPA rank (1-based)
StudentModel.getAttendanceRank(students, studentId)  // Get attendance rank
StudentModel.getActivityRank(students, studentId)    // Get activity rank
```

#### Statistics Methods
```typescript
StudentModel.calculateStats(students)                // Calculate aggregate stats
StudentModel.getAtRiskStudents(students)             // Get students with GPA < 2.5
StudentModel.getHonorRollStudents(students)          // Get students with GPA >= 3.7
```

#### Top Students Methods
```typescript
StudentModel.getTopStudentsByGPA(students, count)    // Top N by GPA
StudentModel.getTopStudentsByAttendance(students, count)
StudentModel.getTopStudentsByActivity(students, count)
```

#### Filter & Search Methods
```typescript
StudentModel.getStudentsByDepartment(students, dept)
StudentModel.getDepartments(students)
StudentModel.searchStudents(students, query)
StudentModel.sortStudents(students, field, order)
```

## 2. Services (`src/app/services/StudentService.ts`)

The service layer handles all API communication and high-level data operations.

### API Methods

```typescript
// Fetch all students from API
StudentService.getAllStudents(): Promise<Student[]>

// Fetch single student
StudentService.getStudentById(id): Promise<Student | null>

// Search students
StudentService.searchStudents(query, students): Promise<Student[]>
```

### Data Retrieval Methods

```typescript
// Get students by criteria
StudentService.getTopStudents(students, metric, count)
StudentService.getAtRiskStudents(students)
StudentService.getHonorRollStudents(students)
StudentService.getStudentsByDepartment(dept, students)

// Get all departments
StudentService.getDepartments(students): string[]

// Get student with rankings
StudentService.getStudentWithRankings(studentId, students)
```

### Calculation Methods

```typescript
// Calculate statistics
StudentService.calculateStats(students): StudentStats

// Get stats by department
StudentService.getStatsByDepartment(dept, students): StudentStats

// Get distribution data for charts
StudentService.getGPADistribution(students)
StudentService.getDepartmentDistribution(students)
```

### Data Organization Methods

```typescript
// Get students grouped by department
StudentService.getStudentsGroupedByDepartment(students)
```

## 3. Context (`src/app/context/StudentContext.tsx`)

The context provides global state management for student data.

### StudentContextType

```typescript
interface StudentContextType {
  students: Student[];           // Array of all students
  loading: boolean;              // Loading state
  addStudent: (student) => void;
  updateStudent: (student) => void;
  deleteStudent: (id) => void;
  refreshStudents: () => Promise<void>;
  fetchStudents: () => Promise<void>;
}
```

### Usage

```typescript
// Wrap app with provider
<StudentProvider>
  <AppContent />
</StudentProvider>

// Use in components
const { students, loading } = useStudents();
```

## 4. Data Flow Example

### Fetching Student Data

```
1. Component mounts → StudentProvider initializes
2. useEffect in StudentProvider calls fetchStudents()
3. fetchStudents() calls StudentService.getAllStudents()
4. StudentService calls API: GET /api/students
5. API returns response with CSV data
6. StudentService normalizes the data
7. StudentProvider sets state with normalized data
8. Components re-render with new student data
```

### Calculating Rankings

```typescript
// In a component
const { students } = useStudents();

// Get student with rankings
const studentWithRanks = StudentService.getStudentWithRankings(
  studentId,
  students
);

// studentWithRanks includes:
// - gpaRank: 3 (top 3 by GPA)
// - attendanceRank: 5
// - activityRank: 2
```

### Getting Statistics

```typescript
// In App.tsx
useEffect(() => {
  if (students.length > 0) {
    const stats = StudentService.calculateStats(students);
    setStats(stats);
  }
}, [students]);

// stats now contains:
// {
//   totalStudents: 62,
//   averageScore: 3.45,
//   attendanceRate: 94.5,
//   honorRoll: 18,
//   atRiskCount: 3
// }
```

## 5. Data Normalization

The StudentService normalizes data from the API to ensure consistent types:

```typescript
// Raw API data
{ id: "1", name: "John", gpa: "3.95", attendance: "98" }

// Normalized to Student interface
{
  id: 1,              // string → number
  name: "John",       // string → string
  gpa: 3.95,          // string → number
  attendance: 98,     // string → number
  activityScore: 92   // string → number
}
```

## 6. CSV Data Source

The backend reads data from: `backend/data/student_data.csv`

**CSV Headers:**
```csv
id,name,department,gpa,attendance,activityScore
```

**Example Data:**
```csv
1,John Doe,CS,3.95,98,92
2,Jane Smith,Math,3.88,96,89
3,Alice Brown,Physics,3.85,99,95
```

## 7. Components Using the Model

### Dashboard Components

| Component | Uses | Purpose |
|-----------|------|---------|
| `StatsCard` | `StudentStats` | Display aggregate metrics |
| `TopStudents` | `getTopStudentsByGPA()` | Show top 5 students |
| `AtRiskStudents` | `getAtRiskStudents()` | Flag students below 2.5 GPA |
| `GradeDistribution` | `getGPADistribution()` | Show GPA histogram |
| `Performance Chart` | `getTopStudents()` | Display performance trends |

### Detail Components

| Component | Uses | Purpose |
|-----------|------|---------|
| `StudentDetailModal` | `getStudentWithRankings()` | Show student details with ranks |
| `StudentSearch` | `searchStudents()` | Find students by name/dept |

## 8. Usage Examples

### Example 1: Get Top 5 Students by GPA

```typescript
import { useStudents } from "./context/StudentContext";
import { StudentService } from "./services";

function TopStudentsComponent() {
  const { students } = useStudents();
  const topStudents = StudentService.getTopStudents(students, 'gpa', 5);
  
  return (
    <div>
      {topStudents.map(student => (
        <div key={student.id}>{student.name} - {student.gpa}</div>
      ))}
    </div>
  );
}
```

### Example 2: Get Student Rankings

```typescript
const studentWithRanks = StudentService.getStudentWithRankings(3, students);

console.log(`${studentWithRanks.name}:`);
console.log(`  GPA Rank: ${studentWithRanks.gpaRank}`);
console.log(`  Attendance Rank: ${studentWithRanks.attendanceRank}`);
console.log(`  Activity Rank: ${studentWithRanks.activityRank}`);
```

### Example 3: Get Department Statistics

```typescript
const deptStats = StudentService.getStatsByDepartment('CS', students);

console.log(`CS Department:`);
console.log(`  Total: ${deptStats.totalStudents}`);
console.log(`  Avg GPA: ${deptStats.averageScore.toFixed(2)}`);
```

### Example 4: Search and Filter

```typescript
// Search by name
const results = StudentService.searchStudents('John', students);

// Get all CS students
const csStudents = StudentService.getStudentsByDepartment('CS', students);

// Sort by GPA descending
const sorted = StudentService.sortStudents(students, 'gpa', 'desc');
```

## 9. Type Safety

All operations are fully typed with TypeScript:

```typescript
// ✅ Type-safe
const student: Student = {
  id: 1,
  name: "John",
  department: "CS",
  gpa: 3.95,
  attendance: 98,
  activityScore: 92
};

// ❌ Type error - missing 'department'
const invalid: Student = {
  id: 1,
  name: "John"
};
```

## 10. Error Handling

The service layer includes error handling:

```typescript
async getAllStudents(): Promise<Student[]> {
  try {
    // Fetch and normalize
    return students;
  } catch (error) {
    console.error('StudentService: Error fetching students:', error);
    return [];  // Return empty array on error
  }
}
```

## 11. Performance Considerations

- **Memoization**: Models use array methods that don't mutate original data
- **Sorting**: Top N operations use `.slice()` for efficiency
- **Filtering**: Department/risk operations filter once
- **Calculations**: Stats are computed once per state change

## 12. Extension Points

### Adding a New Student Field

1. Update `Student` interface in `Student.ts`
2. Update CSV column headers
3. Add normalization in `StudentService.normalizeStudent()`
4. Create helper method in `StudentModel` if needed

### Adding a New Metric

1. Create calculation method in `StudentModel`
2. Expose through `StudentService`
3. Use in components via `useStudents()` and `StudentService`

### Adding New Statistics

1. Update `StudentStats` interface
2. Add calculation logic to `StudentModel.calculateStats()`
3. Display in dashboard `StatsCard` component

## Summary

The model setup provides:
- **Clear separation of concerns** (Models → Services → Context → Components)
- **Type safety** with TypeScript interfaces
- **Reusable logic** in StudentModel and StudentService
- **Efficient data operations** with proper filtering and sorting
- **Easy to test** isolated business logic
- **Scalable** for adding new features

All student data flows through this model setup, ensuring consistency and maintainability throughout the application.
