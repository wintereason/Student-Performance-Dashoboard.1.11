# Quick Start Guide

Get the Student Performance Dashboard running in minutes.

## Prerequisites

- Python 3.8+
- Node.js 14+ and npm
- Ports 5000 and 5173 available

## Setup (5 minutes)

### Option 1: Using Provided Scripts

**Windows:**
```bash
start.bat
```

**Linux/macOS:**
```bash
bash start.sh
```

### Option 2: Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Main Pages

1. **Dashboard** - Overview metrics and trends
2. **Overview** - Top performers and statistics
3. **Analytics** - Detailed performance analysis
4. **Performance** - Performance trends and distributions
5. **Management** - Add, edit, delete student records

## Student Management

The Management page provides a professional interface to manage student records:

- **Add Student**: Click "Add New Student" button to open dialog
- **Edit Student**: Click pencil icon to modify student details
- **Delete Student**: Click trash icon with confirmation dialog
- **Search**: Real-time filtering by name, ID, or department
- **Color-coded Metrics**: Visual indicators for GPA, Attendance, and Activity Score
   - Detail page loads with full profile

3. **Explore the Profile**
   - Scroll down to see all sections
   - Academic Performance
   - Attendance & Engagement  
   - Personal Information
   - Study & Wellbeing
   - Recommendations

4. **Return to Dashboard**
   - Click "Back to Overview" button
   - Back to original view

5. **Try Other Sections**
   - Click "Overview" tab → click student row
   - Click "Students" tab → click student
   - Click "Distribution" tab → click at-risk student
   - Click "Performance" tab → click result row

---

## 📊 What You'll See

### Student Header
- Avatar icon
- Student name & ID
- Department badge
- Grade badge (A, B, C, etc.)
- Performance level (Excellent, Good, etc.)
- Warning indicators (if applicable)

### Academic Performance Card
- Total score (0-100)
- Letter grade
- Progress bar
- Score breakdown:
  - Midterm score
  - Final score
  - Assignments average
  - Quizzes average

### Attendance & Engagement Card
- Attendance percentage with progress bar
- Participation score
- Projects score
- Study hours per week

### Personal Information Card
- Email address
- Gender
- Age
- Department
- Parent education level
- Family income level

### Study & Wellbeing Card
- Study hours per week
- Sleep hours per night
- Stress level (1-10)
- Internet access
- Extracurricular activities

### Performance Summary
- Overall assessment
- Strengths (automatic calculation)
- Recommendations (automatic generation)

---

## 🎨 Color Coding

- 🟢 **Green** - Excellent (90-100)
- 🔵 **Blue** - Very Good (80-89)
- 🟡 **Amber** - Good (70-79)
- 🔴 **Red** - Fair (60-69)
- 🔴 **Dark Red** - Needs Improvement (<60)

---

## ⚠️ Warning Indicators

Watch for these flags:
- ⚠️ Low attendance (< 75%)
- ⚠️ Low study hours (< 5/week)
- ⚠️ High stress level (8+)

---

## 🔄 Navigation Flow

```
Any Student View
    ↓
Click Student Item
    ↓
Student Detail Page
    ↓
Back Button Click
    ↓
Return to Previous View
```

---

## ✅ Verification Checklist

- [ ] Backend running (port 5000)
- [ ] Frontend running (port 5173)
- [ ] Can view dashboard
- [ ] Can click student
- [ ] Detail page loads
- [ ] All info displays
- [ ] Back button works
- [ ] Can click another student
- [ ] Can navigate to other tabs
- [ ] Can click students in other tabs

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check port 5000 is free, Python installed |
| Frontend won't start | Check port 5173 is free, npm installed |
| Detail page blank | Check console for errors, verify API |
| No student data | Ensure student_data.csv exists in backend/data/ |
| Styling looks weird | Clear browser cache (Ctrl+Shift+R) |
| Click not working | Refresh page, check console errors |

---

## 📱 Responsive Testing

### Desktop (1024px+)
- 2-4 column grid layout
- Full feature display

### Tablet (768px-1023px)
- 1-2 column grid
- Adjusted spacing

### Mobile (<768px)
- Single column
- Touch-friendly buttons
- Full-width cards

---

## 🔌 API Endpoints

### Get All Students
```
GET /api/students
```

### Get Single Student
```
GET /api/students/<student_id>
```

Example:
```
GET /api/students/S0001
```

---

## 📊 Sample Data

Click on these students to see different profiles:
- **S0001** - Strong performer (90+ score)
- **S0050** - Average performer (70-80 score)
- **S0100** - At-risk student (below 60)

---

## 💡 Tips

1. **Loading Spinner**: Shows while fetching data from API
2. **Back Button**: Always returns to your previous view
3. **Recommendations**: Auto-generated based on student data
4. **Progress Bars**: Visual representation of percentages
5. **Color Badges**: Quick reference for performance levels

---

## 🎓 Learning Outcomes

This feature demonstrates:
- ✅ React state management
- ✅ Component composition
- ✅ Props drilling
- ✅ API integration
- ✅ Conditional rendering
- ✅ Responsive design
- ✅ Error handling
- ✅ Data transformation

---

## 📞 Need Help?

1. Check console (F12) for errors
2. Verify backend is running
3. Verify frontend is running
4. Refresh page
5. Check student ID exists
6. Try a different student
7. Review VERIFICATION_REPORT.md

---

**Status**: Ready to use! Enjoy exploring student profiles! 🎉
