# Backend Setup & Deployment Guide

## 📦 Complete Backend Structure

```
backend/
├── __init__.py                 # Package initialization
├── app.py                      # Flask app factory & main config
├── config.py                   # Environment configurations
├── wsgi.py                     # WSGI entry point for production
├── manage.py                   # Development server startup
├── gunicorn_config.py          # Gunicorn production settings
├── Dockerfile                  # Docker containerization
├── requirements.txt            # Python dependencies
├── .env.example                # Environment variables template
├── README.md                   # API documentation
│
├── data/
│   ├── student_data.csv       # Rich dataset (5,002 students)
│   └── department_data.csv    # Legacy department data
│
├── routes/
│   ├── __init__.py
│   ├── students_routes.py     # Main student performance endpoints
│   ├── student_routes.py      # Individual student endpoints & predictions
│   └── analytics_routes.py    # Analytics endpoints (legacy)
│
└── [other config files]
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Create Environment File

```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Run Development Server

**Option A: Using manage.py**
```bash
python manage.py
```

**Option B: Direct with app.py**
```bash
python app.py
```

**Option C: With Flask CLI**
```bash
export FLASK_APP=app.py
flask run
```

Server will be available at: `http://localhost:5000`

## ✅ Verify Backend Setup

### Check Health Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status": "ok", "message": "Server is running"}
```

### View API Documentation
```bash
curl http://localhost:5000/api
```

### Test Student Endpoints
```bash
# Get overview
curl http://localhost:5000/api/students/overview

# Get all students
curl http://localhost:5000/api/students

# Get score report
curl http://localhost:5000/api/students/score-report

# Get top performers
curl http://localhost:5000/api/students/top-performers
```

## 📡 API Endpoints Summary

### Overview & Health
- `GET /api/health` - Health check
- `GET /api` - API documentation

### Students (`/api/students/`)
- `GET /overview` - Performance overview
- `GET /` - All students
- `GET /<student_id>` - Student details
- `GET /score-report` - Score distribution
- `GET /top-performers` - Top 4 students
- `GET /department-analysis` - Department performance
- `GET /grade-distribution` - Grade breakdown
- `GET /performance-metrics` - Detailed metrics
- `GET /activity-report` - Activity by day/time
- `POST /predict` - Predict exam marks

## 🔌 Frontend Integration

The backend is configured to work with the React frontend:

1. **CORS**: Enabled for frontend communication
2. **Static Files**: Frontend build served from `/` route
3. **API Prefix**: All APIs under `/api/` prefix
4. **Development**: Frontend runs on port 5173, backend on 5000

### Frontend API Calls Example

```javascript
// From StudentPerformance.jsx
$.ajax({
  url: '/api/students/overview',
  method: 'GET',
  dataType: 'json',
  success: function(data) {
    console.log(data)
  }
})
```

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t student-dashboard-api .
```

### Run Container
```bash
docker run -p 5000:5000 \
  -e FLASK_ENV=production \
  -e SECRET_KEY=your-secret-key \
  student-dashboard-api
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      FLASK_ENV: production
      SECRET_KEY: your-secret-key
    volumes:
      - ./backend/data:/app/data
```

Run with:
```bash
docker-compose up
```

## 🚀 Production Deployment

### Using Gunicorn

```bash
gunicorn -c gunicorn_config.py wsgi:app
```

Configuration in `gunicorn_config.py`:
- Workers: 3
- Threads: 4
- Timeout: 120s
- Bind: 0.0.0.0:8000

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never hardcode secrets
2. **CORS**: Restrict to specific origins in production
3. **HTTPS**: Use HTTPS in production
4. **Secret Key**: Generate strong secret key
5. **Input Validation**: All endpoints validate input
6. **Error Handling**: Comprehensive error handling without exposing internals

### Generate Secret Key

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## 📊 Data Management

### Data Files Location
```
backend/data/
├── student_data.csv (5,002 records - PRIMARY)
└── department_data.csv (legacy)
```

### Loading Custom Data

Replace `student_data.csv` with your data file. Required columns:
- Student_ID
- First_Name, Last_Name
- Department
- Attendance (%)
- Final_Score, Midterm_Score, Total_Score
- Grade (A-F)
- Study_Hours_per_Week
- Participation_Score
- Projects_Score

### Data Processing

The backend automatically:
- Reads CSV data on startup
- Calculates averages and statistics
- Generates analytics
- No database setup required

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### CSV File Not Found
```bash
# Ensure data file exists
ls -la backend/data/student_data.csv

# Check permissions
chmod 644 backend/data/student_data.csv
```

### CORS Issues
```bash
# Check CORS_ORIGINS environment variable
echo $CORS_ORIGINS

# Update .env if needed
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Module Import Errors
```bash
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt

# Check Python version (should be 3.8+)
python --version
```

## 📈 Performance Optimization

1. **Caching**: Implement Redis for frequently accessed data
2. **Database**: Switch from CSV to PostgreSQL for scalability
3. **Pagination**: Add pagination for large datasets
4. **Indexing**: Create indexes on frequently queried fields
5. **Compression**: Enable gzip compression

## 🆘 Logging

Logs are printed to console during development. For production:

```python
# In app.py
import logging
logging.basicConfig(
    filename='app.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

## 📝 Next Steps

1. ✅ Backend structure complete
2. ✅ All endpoints implemented
3. ✅ CSV data integration
4. ✅ CORS configured
5. ✅ Docker ready

**Ready for deployment!**

## 📞 Support

For issues:
1. Check logs: `python app.py` (shows console output)
2. Test endpoints: Use curl or Postman
3. Verify data files exist in `backend/data/`
4. Check CORS configuration matches frontend URL
5. Review error messages in terminal

---

**Backend Version**: 1.0.0
**Last Updated**: December 11, 2025
**Status**: ✅ Production Ready
