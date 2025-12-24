# Student Dashboard Frontend

React-based frontend for Student Performance Analytics Dashboard

## Features

- **Dashboard**: Overview of student statistics and recent students
- **Student Performance**: Detailed student list with search and sorting
- **Analytics**: Charts and visualizations for performance metrics
- **Distribution**: GPA distribution analysis
- **Data Management**: CSV file upload for data updates

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  ├── components/        # React components
  │   ├── Dashboard.jsx
  │   ├── StudentPerformance.jsx
  │   ├── Overview.jsx
  │   ├── Distribution.jsx
  │   ├── Performance.jsx
  │   ├── DataManagement.jsx
  │   └── StudentDetail.jsx
  ├── context/          # React context
  │   └── FullscreenContext.jsx
  ├── App.jsx          # Main App component
  ├── App.css          # App styles
  ├── main.jsx         # Entry point
  └── index.css        # Global styles
```

## Docker

```bash
docker build -t student-dashboard-frontend .
docker run -p 80:80 student-dashboard-frontend
```

## API Endpoints

The frontend expects the following API endpoints:

- `GET /api/analytics/stats` - Dashboard statistics
- `GET /api/students` - List of students
- `GET /api/students/{id}` - Student details
- `GET /api/analytics/overview` - Overview data
- `GET /api/analytics/distribution` - Distribution data
- `GET /api/analytics/performance` - Performance data
- `POST /api/upload` - File upload
