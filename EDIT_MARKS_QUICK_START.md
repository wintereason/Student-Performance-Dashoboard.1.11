# Edit Marks Feature - Quick Start Guide

## What's New?

You can now **edit student marks** directly in the Student Marks History table. When you change assignment, test, project, or quiz values, the total marks and percentage are automatically calculated and saved to the database.

## How to Use

### 1. Navigate to Student Marks History
- Open the Dashboard
- Go to **Management Board** → **Student Marks History** tab
- OR click directly on the sidebar link

### 2. Search for a Student
- Enter student name or roll number in the search box
- Click on the student from results
- The marks table will display all their subjects

### 3. Edit a Subject's Marks
- Find the subject you want to edit
- Click the **pencil icon** in the "Action" column (rightmost)
- The edit modal will open

### 4. Modify Values
The modal has 4 input fields:

| Field | Range | Current Value |
|-------|-------|---------------|
| Assignment | 0-20 | Auto-filled |
| Test | 0-25 | Auto-filled |
| Project | 0-25 | Auto-filled |
| Quiz | 0-15 | Auto-filled |

**Real-time Calculation:**
As you type, you'll see:
- **Total Marks:** Automatically calculated as sum of all components
- **Percentage:** Automatically calculated as (Total / 100) * 100
- **Performance Level:** Shown with color coding:
  - 🟢 Green (≥80%): Excellent
  - 🟡 Yellow (60-79%): Good  
  - 🔴 Red (<60%): Needs Improvement

### 5. Save Changes
- Review the calculated total and percentage
- Click **"Save Changes"** button
- Modal closes automatically
- Table updates with new values

## Validation Rules

✅ **Allowed Values:**
- Assignment: Between 0 and 20
- Test: Between 0 and 25
- Project: Between 0 and 25
- Quiz: Between 0 and 15

❌ **Invalid Values:**
- Negative numbers
- Values exceeding maximum
- Non-numeric input

If you enter an invalid value, an error message will appear. Correct it before saving.

## What Happens After Save?

1. ✓ New values saved to database
2. ✓ Table immediately updates with new marks
3. ✓ Total and percentage automatically recalculated
4. ✓ Color coding updates based on new percentage
5. ✓ **Pie chart automatically reflects new data**
6. ✓ **At-risk student status updates if needed**

## Examples

### Example 1: Improve Performance
**Before:**
- Assignment: 10, Test: 15, Project: 12, Quiz: 8
- Total: 45, Percentage: 45% (Red - Needs Improvement)

**Edit to:**
- Assignment: 18, Test: 22, Project: 20, Quiz: 14
- Total: 74, Percentage: 74% (Yellow - Good)

### Example 2: Correct a Mistake
**Before:**
- Assignment: 5, Test: 25, Project: 25, Quiz: 15
- Total: 70, Percentage: 70%

**Edit to:**
- Assignment: 20, Test: 25, Project: 25, Quiz: 15
- Total: 85, Percentage: 85% (Green - Excellent)

## Auto-Calculation Formula

```
Total Marks = Assignment + Test + Project + Quiz
Percentage = (Total Marks / 100) * 100
```

The percentage is automatically colored:
- **≥80%** → Green (Excellent)
- **60-79%** → Yellow (Good)
- **<60%** → Red (Needs Improvement)

## Tips & Tricks

💡 **Tip 1:** The modal remembers current values - no need to manually enter the old ones

💡 **Tip 2:** You can edit multiple students in sequence - just close the modal and select a new student

💡 **Tip 3:** Changes appear instantly in the table and pie chart

💡 **Tip 4:** All changes are saved to the database - refreshing the page will still show updated values

## Troubleshooting

### "Error: Assignment must be between 0 and 20"
**Solution:** The value you entered exceeds the allowed range. Use a value between 0 and 20.

### Modal won't close after clicking Save
**Solution:** Check for error messages at the top of the modal. Fix any validation errors and try again.

### Table doesn't update after saving
**Solution:** 
1. Close the modal
2. Try refreshing the page (Ctrl+F5)
3. Select the student again

### Changes not appearing in pie chart
**Solution:**
1. The pie chart loads data from the same table
2. Refresh the page if needed (Ctrl+F5)
3. The chart will automatically use updated values

## System Requirements

- Modern web browser (Chrome, Firefox, Edge, Safari)
- JavaScript enabled
- Backend server running (`python run.py` in backend folder)
- Frontend running (`npm run dev` in frontend folder)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Move to next field |
| `Shift+Tab` | Move to previous field |
| `Enter` | Submit form (same as clicking Save) |
| `Esc` | Close modal (same as clicking Cancel) |

## Database Impact

All changes are immediately saved to the SQLite database:
- **Database:** `backend/student_dashboard.db`
- **Table:** `student_subject`
- **Columns Updated:** `assignment`, `test`, `project`, `quiz`, `marks`, `percentage`

## Version Information

- **Feature Version:** 1.0
- **Release Date:** December 2025
- **Status:** Production Ready

## Get Help

For detailed technical documentation, see: **[EDIT_MARKS_FEATURE.md](./EDIT_MARKS_FEATURE.md)**

For setup instructions, see: **[GET_STARTED_NOW.md](./GET_STARTED_NOW.md)**

---

**Happy Editing! 🎓**
