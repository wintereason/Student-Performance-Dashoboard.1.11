# Student Marks History - Quick Start (2 Minutes)

## ⚡ TL;DR Setup

### 1. Verify Everything is Ready
```bash
cd backend
python seed_marks_data.py  # Already done ✅
```

### 2. Start the App
```bash
# Terminal 1 - Backend
cd backend && python app.py

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### 3. Open Dashboard
Visit: **http://127.0.0.1:5000**

---

## 📍 Where to Find It

1. Click **"Student Marks History"** in the sidebar menu
2. You should see a search box

---

## 🔍 How It Works (30 seconds)

### Search for a Student
Type in search box (try these):
- `John Smith` - Search by name
- `1` - Search by ID
- `Emma` - Partial name search

**Result**: Dropdown shows matching students

### Select a Student
Click on any student name in dropdown

**Result**: You'll see:
```
Student: John Smith (ID: 1)
Department: Computer Science
GPA: 3.5

[TABLE with marks]
Subject | Assignment | Test | Project | Quiz | Total | %
Physics |     13     |  21  |   15    |  9   | 58/100| 58%
Chemistry|    14     |  25  |   22    | 12   | 73/100| 73%
...more subjects...
```

---

## 🎨 Color Coding

- 🟢 **Green** (≥80%): Excellent performance
- 🟡 **Yellow** (60-79%): Good performance  
- 🔴 **Red** (<60%): Needs improvement

---

## 📊 Sample Data Included

**6 Students × 3-5 Subjects = 25 Marks Records**

Each mark includes:
- Assignment (0-20 pts)
- Test (0-25 pts)
- Project (0-25 pts)
- Quiz (0-15 pts)
- **Total: 0-100 pts**

---

## ✨ Key Features

✅ Real-time search (name or ID)  
✅ Student info card display  
✅ Detailed marks breakdown  
✅ Component-wise scoring  
✅ Color-coded performance  
✅ Auto-calculated percentages  
✅ Responsive table  
✅ Loading indicators  

---

## 🔌 Behind the Scenes

**Database**: SQLite with student_subjects table
- `assignment` - Component marks
- `test` - Component marks
- `project` - Component marks
- `quiz` - Component marks
- `marks` - Total marks
- `percentage` - Auto-calculated

**API**: `GET /api/subjects/student/{id}/marks`

**Frontend**: React component with real-time data fetching

---

## 🚨 Troubleshooting

| Problem | Fix |
|---------|-----|
| No data shows | Refresh page with Ctrl+R |
| Search returns nothing | Try searching by ID (1, 2, etc.) |
| API error | Check backend is running on port 5000 |
| Marks empty | Run `python seed_marks_data.py` again |

---

## 📱 Example Search Results

```
Input: "john"
↓
Matches:
  → #1 John Smith (Computer Science)
  
Click on: John Smith
↓
Shows his 5 subjects:
  • Physics (58%)
  • Economics (70%)
  • Chemistry (73%)
  • Biology (64%)
  • History (76%)
```

---

## 🎯 What's Connected

This feature is **fully integrated** with:
- ✅ Pie Chart (uses same database)
- ✅ At-Risk Students (clickable detail modals)
- ✅ Dashboard data (real-time sync)
- ✅ Performance analytics (uses these marks)

---

## 📈 Next: Customize

Want to add more subjects or students?

1. Edit `backend/seed_marks_data.py`:
   - Change `subjects_list` array
   - Modify mark ranges
   - Run: `python seed_marks_data.py`

2. Edit `subject-management.tsx` colors:
   - Find color threshold sections
   - Change from `80` and `60` to your values

---

**You're ready!** 🎉

Go to dashboard and try searching for a student now.
