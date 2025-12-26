# Edit Marks Feature - Complete Setup Guide

## Overview

This guide provides complete documentation for the **Edit Marks** feature, which allows users to edit assignment, test, project, and quiz values for student marks, with automatic calculation of total marks and percentages.

## Architecture

### Frontend Components

#### 1. **SubjectManagement Component** (`subject-management.tsx`)
Main component that displays student marks and provides edit functionality.

**Key States:**
- `selectedStudent`: Currently selected student
- `marksData`: Array of student mark entries
- `editingMark`: Currently selected mark entry for editing
- `isEditModalOpen`: Controls modal visibility
- `loading`: Loading state for API calls
- `searchQuery`: Search input for filtering students

**Key Functions:**
- `fetchMarksData()`: Fetches marks for selected student from backend
- `handleEditClick(mark)`: Opens edit modal for selected mark
- `handleSaveMarks(updatedData)`: Updates local state with new marks data

**API Integration:**
```javascript
// Fetch marks for student
GET http://127.0.0.1:5000/api/subjects/student/{studentId}/marks

// Update marks for a subject
PUT http://127.0.0.1:5000/api/subjects/student/{studentId}/subject/{subjectId}
Body: { assignment, test, project, quiz }
```

#### 2. **EditMarksModal Component** (`edit-marks-modal.tsx`)
Modal dialog for editing individual mark components.

**Props:**
```typescript
interface EditMarksModalProps {
  isOpen: boolean;                 // Control modal visibility
  onClose: () => void;             // Callback to close modal
  studentId: number;               // Student ID
  subjectId: number;               // Subject ID
  subjectName: string;             // Subject name for display
  currentAssignment: number;       // Current assignment marks
  currentTest: number;             // Current test marks
  currentProject: number;          // Current project marks
  currentQuiz: number;             // Current quiz marks
  onSaveSuccess?: (data: any) => void;  // Callback after successful save
}
```

**Features:**
- 4 input fields with min/max constraints:
  - Assignment: 0-20
  - Test: 0-25
  - Project: 0-25
  - Quiz: 0-15
- Real-time auto-calculation display:
  - Total Marks: Sum of all components
  - Percentage: (Total / 100) * 100
  - Color-coded percentage display
- Form validation with error messages
- Loading state during API call
- Success callback integration

**Auto-calculation Logic (Frontend):**
```typescript
totalMarks = assignment + test + project + quiz
percentage = (totalMarks / 100) * 100
```

### Backend API

#### PUT Endpoint: `/api/subjects/student/{student_id}/subject/{subject_id}`

**Purpose:** Update student marks for a specific subject with auto-calculation

**Request:**
```json
{
  "assignment": 18,
  "test": 22,
  "project": 20,
  "quiz": 14
}
```

**Response (Success 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "student_id": 1,
    "subject_name": "Math",
    "assignment": 18,
    "test": 22,
    "project": 20,
    "quiz": 14,
    "marks": 74,
    "maxMarks": 100,
    "percentage": 74.0
  },
  "message": "Marks updated successfully"
}
```

**Validation:**
```python
# Component range validation (in Flask backend)
Assignment: 0-20
Test: 0-25
Project: 0-25
Quiz: 0-15
```

**Auto-calculation (Backend):**
```python
total_marks = assignment + test + project + quiz
percentage = (total_marks / maxMarks) * 100
```

## Data Flow

### Edit Flow Sequence

1. **User Interaction:**
   - User clicks edit button (pencil icon) on a mark row
   - `handleEditClick(entry)` is called
   - Modal opens with current values pre-populated

2. **Frontend Validation:**
   - User modifies values in input fields
   - Real-time calculation shows updated total and percentage
   - Error message shown if values are out of range

3. **API Request:**
   - User clicks "Save Changes"
   - Frontend sends PUT request with new values
   - Loading state displayed during API call

4. **Backend Processing:**
   - Validate all component values
   - Auto-calculate total: `assignment + test + project + quiz`
   - Auto-calculate percentage: `(total / maxMarks) * 100`
   - Update database record
   - Return updated subject with calculated values

5. **Frontend Update:**
   - Modal closes on success
   - `handleSaveMarks()` updates local state
   - Table re-renders with new values
   - Pie chart automatically reflects new data
   - Success confirmation (silent)

### Data Structure

**StudentMarksEntry Interface:**
```typescript
interface StudentMarksEntry {
  id: number;              // Subject ID
  subject: string;         // Subject name
  assignment: number;      // Assignment marks (0-20)
  test: number;           // Test marks (0-25)
  project: number;        // Project marks (0-25)
  quiz: number;           // Quiz marks (0-15)
  totalMarks: number;     // Auto-calculated total
  maxMarks: number;       // Maximum possible marks (100)
}
```

**Database Model (StudentSubject):**
```python
class StudentSubject(db.Model):
    # Existing columns
    marks: Float           # Total marks (auto-calculated)
    maxMarks: Float        # Max marks
    percentage: Float      # Percentage (auto-calculated)
    
    # Component columns
    assignment: Float = 0  # Assignment marks
    test: Float = 0        # Test marks
    project: Float = 0     # Project marks
    quiz: Float = 0        # Quiz marks
```

## Integration Points

### 1. Subject Performance Pie Chart
- Uses same data source as marks table
- Automatically updates when marks are edited
- Percentage calculated from component breakdown

### 2. At-Risk Students Dashboard
- GPA calculation depends on overall marks
- May update at-risk status if marks changed significantly
- Uses real-time data from StudentSubject table

### 3. Student Context
- Provides student list for search functionality
- No real-time updates needed (marks don't affect student metadata)

## Testing Workflow

### End-to-End Test Steps

1. **Start Servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python run.py
   # Expect: "Running on http://127.0.0.1:5000"
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   # Expect: "VITE v6.x.x ready at http://localhost:5174"
   ```

2. **Access Application:**
   - Open http://localhost:5174
   - Navigate to Management Board → Student Marks History tab

3. **Search Student:**
   - Enter student name/ID in search box (e.g., "John Smith")
   - Click on result to select student
   - Verify marks table displays all subjects

4. **Edit Marks:**
   - Locate a subject row
   - Click pencil icon in "Action" column
   - Modal opens with current values
   - Modify values:
     - Assignment: Change from X to Y
     - Test: Change from X to Y
     - Project: Change from X to Y
     - Quiz: Change from X to Y
   - Observe real-time calculation:
     - Total updates: sum of all components
     - Percentage updates: (total / 100) * 100
     - Color changes based on percentage threshold

5. **Validate:**
   - Try entering invalid value (e.g., Assignment > 20)
   - Error message appears: "Assignment must be between 0 and 20"
   - Save button disabled

6. **Save Changes:**
   - Enter valid values
   - Click "Save Changes"
   - Observe loading indicator
   - Modal closes automatically
   - Table updates with new values
   - Pie chart reflects new data

7. **Verify Persistence:**
   - Refresh page
   - Search for same student
   - Confirm marks still show updated values

8. **Check Updates:**
   - Navigate to other components
   - Verify pie chart updated
   - Check at-risk students (if GPA affected)

## Component Configuration

### Assignment Ranges
| Component | Min | Max | Weight |
|-----------|-----|-----|--------|
| Assignment | 0 | 20 | 20% |
| Test | 0 | 25 | 25% |
| Project | 0 | 25 | 25% |
| Quiz | 0 | 15 | 15% |
| **Total** | **0** | **85** | **100%** |

**Note:** Current implementation assumes max total = 100, but can be adjusted in database schema.

## Styling & UI

### Modal Design
- Dark theme (Slate-800 background)
- Blue accent colors for buttons
- Red for error messages
- Input fields with hover/focus states
- Loading state for save button

### Table Integration
- Pencil icon (Lucide React) in action column
- Hover effect on edit button
- Color-coded badges for each component
- Performance indicators on total/percentage

### Color Coding (Percentage)
- **Green (≥80%):** Excellent
- **Yellow (60-79%):** Good
- **Red (<60%):** Needs Improvement

## API Error Handling

### Common Error Responses

**400 - Validation Error:**
```json
{
  "success": false,
  "error": "Assignment must be between 0 and 20"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "error": "Student not found"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "error": "Database connection error"
}
```

## Performance Optimization

### Frontend
- `useMemo` for filtered student list
- `useEffect` with dependency array for API calls
- Local state updates (no full page refresh)
- Modal component unmounts on close

### Backend
- Direct database query (no N+1)
- Single update statement
- Minimal logging in production

## Security Considerations

1. **Input Validation:**
   - Range checking on all numeric inputs
   - Type checking (float/number)
   - Frontend validation prevents invalid API calls

2. **API Security:**
   - Student ID validated (student must exist)
   - Subject ID validated (must belong to student)
   - All numeric values sanitized

3. **XSS Protection:**
   - React automatically escapes values
   - No dangerouslySetInnerHTML used

## Troubleshooting

### Modal Won't Open
**Problem:** Click edit button, nothing happens
**Solution:** Check console for errors, verify studentId and subjectId are passed correctly

### Changes Don't Save
**Problem:** Modal closes but table doesn't update
**Solution:** 
- Check browser console for API errors
- Verify backend server is running
- Check network tab in DevTools

### Calculation Wrong
**Problem:** Total or percentage shows incorrect value
**Solution:**
- Frontend calculation: `assignment + test + project + quiz`
- Backend calculation: `(total / maxMarks) * 100`
- Ensure maxMarks is 100 in database

### Pie Chart Not Updating
**Problem:** Pie chart shows old values after edit
**Solution:**
- Both components use same data source
- Try page refresh
- Check if data fetch is using correct endpoint

## Advanced Configuration

### Adjusting Component Ranges

To change the max values for components:

**Frontend (edit-marks-modal.tsx):**
```typescript
const MAX_ASSIGNMENT = 20;  // Change this value
const MAX_TEST = 25;         // Change this value
const MAX_PROJECT = 25;      // Change this value
const MAX_QUIZ = 15;         // Change this value
const TOTAL_MAX = 100;       // Change this value
```

**Backend (subjects_routes.py):**
```python
# Update validation ranges
if assignment < 0 or assignment > 20:
    # Change the constraint
```

**Database (if needed):**
Update the `StudentSubject` model's `maxMarks` field default or constraint.

## Future Enhancements

1. **Bulk Edit:** Edit multiple students at once
2. **Undo/Redo:** Revert changes with history
3. **Audit Trail:** Log who changed what and when
4. **Export:** Export marked changes to CSV/PDF
5. **Notifications:** Email student when marks updated
6. **Analytics:** Track mark changes over time

## Support & Documentation

- **Related Files:**
  - Frontend: `frontend/src/app/components/subject-management.tsx`
  - Frontend: `frontend/src/app/components/edit-marks-modal.tsx`
  - Backend: `backend/routes/subjects_routes.py`
  - Models: `backend/models/database_models.py`

- **Testing:**
  - Database: `student_dashboard.db` (SQLite)
  - Sample data: Auto-populated via seed scripts

---

**Last Updated:** 2025-12-26
**Version:** 1.0
**Status:** Production Ready
