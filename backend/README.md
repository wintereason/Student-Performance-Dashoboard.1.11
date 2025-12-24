# Student Performance Dashboard - Backend API

A comprehensive REST API for managing and analyzing student performance data. Built with Flask and featuring CSV-based data storage with rich analytics capabilities.

## 📋 Features

- **Student Performance Analytics**: Comprehensive student metrics and performance tracking
- **Score Distribution Analysis**: Categorize students by score ranges
- **Department Performance**: Analyze performance across different departments
- **Top Performers**: Identify and rank top-performing students
- **Grade Distribution**: Visual breakdown of letter grades
- **Performance Metrics**: Detailed performance indicators
- **Activity Reports**: Track student activity patterns
- **RESTful API**: Clean, well-documented endpoints

## 🚀 Quick Start

### Installation

1. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   ```bash
   # Create .env file
   cat > .env << EOF
   FLASK_ENV=development
   SECRET_KEY=your-secret-key-here
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   EOF
   ```

3. **Run development server**:
   ```bash
   python app.py
   ```
   
   Server will be available at `http://localhost:5000`

### Production Deployment

**Using Gunicorn**:
```bash
pip install gunicorn
gunicorn -c gunicorn_config.py wsgi:app
```

**Using Docker** (if configured):
```bash
docker build -t student-dashboard-api .
docker run -p 5000:5000 student-dashboard-api
```

## 📚 API Endpoints

### Overview & Health

- `GET /api/health` - Health check
- `GET /api` - API documentation and endpoints list

### Student Endpoints (`/api/students/`)

#### Overview & Summary
- `GET /overview` - Student performance overview with key metrics
- `GET /` - Get all students
- `GET /<student_id>` - Get specific student details

#### Analytics
- `GET /score-report` - Score distribution report (6 ranges)
- `GET /top-performers` - Top 4 performing students
- `GET /department-analysis` - Performance by department
- `GET /grade-distribution` - Distribution of letter grades (A-F)
- `GET /performance-metrics` - Detailed performance metrics

#### Activity
- `GET /activity-report` - Student activity by day and time

### Prediction Endpoints (`/api/students/`)

- `POST /predict` - Predict student exam marks based on metrics

## 📊 Response Examples

### Student Overview
```json
{
  "totalStudents": {
    "current": 5002,
    "previous": 4952
  },
  "averageGrade": {
    "current": 72.5,
    "previous": 68.3
  },
  "attendanceRate": {
    "current": 78.2,
    "previous": 75.8
  },
  "performanceGrowth": {
    "current": 12.5,
    "previous": 8.2
  }
}
```

### Score Report
```json
[
  {
    "range": "90-100",
    "count": 152,
    "percentage": 3.0
  },
  {
    "range": "80-89",
    "count": 684,
    "percentage": 13.7
  }
]
```

### Top Performers
```json
[
  {
    "id": "S1234",
    "name": "John Doe",
    "email": "john@university.com",
    "department": "Computer Science",
    "grade": "A",
    "score": 92,
    "improvement": 15,
    "attendance": 97.5,
    "participation": 89.2
  }
]
```

## 🗂️ Project Structure

```
backend/
├── app.py                    # Flask app factory and main configuration
├── config.py                 # Environment-specific configurations
├── wsgi.py                   # WSGI entry point (production)
├── gunicorn_config.py        # Gunicorn production settings
├── requirements.txt          # Python dependencies
├── data/
│   ├── student_data.csv     # Rich student dataset (5,002 records)
│   └── department_data.csv  # Legacy department data
├── routes/
│   ├── __init__.py
│   ├── students_routes.py   # Main student performance endpoints
│   ├── student_routes.py    # Individual student endpoints
│   └── analytics_routes.py  # Analytics endpoints (legacy)
├── __init__.py
└── README.md
```

## 📦 Data Format

### Student Data CSV Columns

The API expects a CSV file (`student_data.csv`) with these columns:

| Column | Type | Description |
|--------|------|-------------|
| Student_ID | string | Unique student identifier |
| First_Name | string | Student first name |
| Last_Name | string | Student last name |
| Email | string | Student email |
| Gender | string | M/F |
| Age | integer | Student age |
| Department | string | Department name |
| Attendance (%) | float | Attendance percentage |
| Midterm_Score | float | Midterm exam score |
| Final_Score | float | Final exam score |
| Assignments_Avg | float | Average assignment score |
| Quizzes_Avg | float | Average quiz score |
| Participation_Score | float | Participation score |
| Projects_Score | float | Project score |
| Total_Score | float | Overall score |
| Grade | string | Letter grade (A-F) |
| Study_Hours_per_Week | float | Weekly study hours |
| Extracurricular_Activities | string | Yes/No |
| Internet_Access_at_Home | string | Yes/No |
| Parent_Education_Level | string | Education level |
| Family_Income_Level | string | Income level |
| Stress_Level (1-10) | integer | Stress level |
| Sleep_Hours_per_Night | float | Sleep hours |

## 🔐 Security

- **CORS**: Configured to allow frontend communication
- **Environment Variables**: Sensitive data stored in `.env`
- **Error Handling**: Comprehensive error handling with logging
- **Input Validation**: Request validation on all endpoints

## 📝 Configuration

### Development Environment
```
FLASK_ENV=development
DEBUG=True
SECRET_KEY=dev-secret-key
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Production Environment
```
FLASK_ENV=production
DEBUG=False
SECRET_KEY=<secure-random-key>
CORS_ORIGINS=https://yourdomain.com
```

## 🔧 Troubleshooting

### CSV File Not Found
- Ensure `student_data.csv` exists in the `data/` folder
- Check file permissions
- Verify file encoding (should be UTF-8)

### CORS Errors
- Update `CORS_ORIGINS` environment variable
- Check frontend URL in CORS configuration
- Verify API is accessible from frontend

### Port Already in Use
```bash
# Change port in app.py or use:
python app.py --port 5001
```

## 📈 Performance Metrics Calculated

- **Average Grade**: Mean of all Total_Score values
- **Attendance Rate**: Mean of all Attendance (%) values
- **Performance Growth**: Percentage of students above median score
- **Top Performers**: Top 4 by Total_Score with improvement calculation
- **Score Distribution**: Students categorized into 6 score ranges
- **Grade Distribution**: Count of A, B, C, D, F grades

## 🚀 Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Advanced ML prediction models
- [ ] Real-time data streaming
- [ ] Caching layer (Redis)
- [ ] Export to PDF/Excel
- [ ] Student recommendation system
- [ ] Automated alert system
- [ ] Advanced filtering and search

## 📄 Dependencies

See `requirements.txt` for all dependencies:
- Flask 2.3.4
- Flask-CORS 4.0.0
- Pandas 2.2.3
- Python-dotenv 1.0.0
- Gunicorn 21.2.0 (production)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check logs for detailed error messages

## 📄 License

MIT License - See LICENSE file for details

---

**Last Updated**: December 11, 2025
**API Version**: 1.0.0
