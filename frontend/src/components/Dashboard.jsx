import React, { useState, useEffect } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, BookOpen, Award, Calendar, Trophy, Medal } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageScore: 0,
    passRate: 0,
    atRisk: 0
  })
  const [allStudents, setAllStudents] = useState([])
  const [topScorers, setTopScorers] = useState([])
  const [gradeData, setGradeData] = useState([])
  const [subjectData, setSubjectData] = useState([])
  const [gradeDistributionData, setGradeDistributionData] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedStudentSubjects, setSelectedStudentSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (selectedStudent) {
      fetchSelectedStudentSubjects(selectedStudent.id)
    }
  }, [selectedStudent])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/students')
      const result = await response.json()
      
      if (result.success && result.data.length > 0) {
        setAllStudents(result.data)
        calculateStats(result.data)
        calculateTopScorers(result.data)
        calculateGradeDistribution(result.data)
        calculateSubjectPerformance(result.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (students) => {
    const totalStudents = students.length
    
    let totalGPA = 0
    let passCount = 0
    let atRiskCount = 0

    students.forEach(student => {
      const gpa = parseFloat(student.gpa) || 0
      totalGPA += gpa
      
      if (gpa >= 3.0) passCount++
      if (gpa < 2.5) atRiskCount++
    })

    const averageScore = totalStudents > 0 ? (totalGPA / totalStudents).toFixed(2) : 0
    const passRate = totalStudents > 0 ? ((passCount / totalStudents) * 100).toFixed(1) : 0

    setStats({
      totalStudents,
      averageScore,
      passRate,
      atRisk: atRiskCount
    })
  }

  const calculateTopScorers = (students) => {
    const sorted = [...students]
      .sort((a, b) => parseFloat(b.gpa) - parseFloat(a.gpa))
      .slice(0, 5)
      .map((student, index) => ({
        id: student.id,
        name: student.name,
        gpa: parseFloat(student.gpa),
        rank: index + 1,
        department: student.department
      }))
    
    setTopScorers(sorted)
  }

  const calculateGradeDistribution = (students) => {
    const gradeCount = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 }
    
    students.forEach(student => {
      const gpa = parseFloat(student.gpa) || 0
      if (gpa >= 3.5) gradeCount['A']++
      else if (gpa >= 3.0) gradeCount['B']++
      else if (gpa >= 2.5) gradeCount['C']++
      else if (gpa >= 2.0) gradeCount['D']++
      else gradeCount['F']++
    })

    const data = Object.entries(gradeCount).map(([grade, count]) => ({
      name: `Grade ${grade}`,
      Students: count
    }))

    setGradeData(data)

    // Also set grade distribution data for the breakdown card
    const gradeDistribution = [
      { grade: 'A', count: gradeCount['A'], color: '#10b981', percentage: (gradeCount['A'] / students.length * 100).toFixed(1) },
      { grade: 'B', count: gradeCount['B'], color: '#3b82f6', percentage: (gradeCount['B'] / students.length * 100).toFixed(1) },
      { grade: 'C', count: gradeCount['C'], color: '#f59e0b', percentage: (gradeCount['C'] / students.length * 100).toFixed(1) },
      { grade: 'D', count: gradeCount['D'], color: '#ef8657', percentage: (gradeCount['D'] / students.length * 100).toFixed(1) },
      { grade: 'F', count: gradeCount['F'], color: '#ef4444', percentage: (gradeCount['F'] / students.length * 100).toFixed(1) }
    ]
    setGradeDistributionData(gradeDistribution)
  }            avgScore,
            color: subjectColors[index % subjectColors.length]
          }
        })

        setSubjectData(subjects)
      } else {
        // No subjects added yet
        setSubjectData([])
      }
    } catch (error) {
      console.error('Error calculating subject performance:', error)
    }
  }

  if (loading) return <div className="dashboard-loading">Loading dashboard...</div>

  const passFailData = [
    { name: 'Pass', value: stats.totalStudents - stats.atRisk, color: '#10b981' },
    { name: 'Fail', value: stats.atRisk, color: '#ef4444' }
  ]

  const rankConfig = {
    1: { icon: Trophy, color: '#fbbf24' },
    2: { icon: Medal, color: '#9ca3af' },
    3: { icon: Medal, color: '#ea580c' },
  }

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header-section">
        <div className="header-wrapper">
          <div className="header-title-group">
            <h1 className="header-title">Student Performance Dashboard</h1>
            <p className="header-subtitle">Academic Year 2024-2025</p>
          </div>
          <div className="header-date-group">
            <Calendar className="header-icon" />
            <span className="header-date">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Stats Cards Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Total Students</h3>
              <Users className="stat-card-icon" />
            </div>
            <div className="stat-card-value">{stats.totalStudents}</div>
            <div className="stat-card-subtitle">Active this semester</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Average Score</h3>
              <TrendingUp className="stat-card-icon" />
            </div>
            <div className="stat-card-value">{stats.averageScore}</div>
            <div className="stat-card-subtitle">Across all subjects</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Pass Rate</h3>
              <BookOpen className="stat-card-icon" />
            </div>
            <div className="stat-card-value">{stats.passRate}%</div>
            <div className="stat-card-subtitle positive">This semester</div>
          </div>

          <div className={`stat-card ${stats.atRisk > 0 ? 'at-risk-state' : ''}`}>
            <div className="stat-card-header">
              <h3 className="stat-card-title">At Risk</h3>
              <Award className={`stat-card-icon ${stats.atRisk > 0 ? 'risk-icon' : ''}`} />
            </div>
            <div className={`stat-card-value ${stats.atRisk > 0 ? 'risk-value' : ''}`}>{stats.atRisk}</div>
            <div className="stat-card-subtitle">
              {stats.atRisk > 0 ? (
                <span className="risk-indicator">⚠️ Requires immediate attention</span>
              ) : (
                <span className="safe-indicator">✓ All students performing well</span>
              )}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Exam Status */}
          <div className="chart-card lg-span">
            <h3 className="chart-card-title">Exam Status Overview</h3>
            <p className="chart-card-desc">Distribution of students by exam performance</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={passFailData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {passFailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Grade Distribution */}
          <div className="chart-card">
            <h3 className="chart-card-title">Grade Distribution</h3>
            <p className="chart-card-desc">Current semester grade breakdown</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="Students" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Scorers */}
        <div className="chart-card full-width">
          <h3 className="chart-card-title">Top 5 Scorer Students</h3>
          <div className="top-scorers-list">
            {topScorers.map((student) => {
              const rankStyle = rankConfig[student.rank]
              const Icon = rankStyle.icon
              
              return (
                <div key={student.id} className="scorer-row">
                  <div className="scorer-badge" style={{ backgroundColor: `${rankStyle.color}20` }}>
                    <Icon size={20} style={{ color: rankStyle.color }} />
                  </div>
                  <div className="scorer-info-main">
                    <div className="scorer-name-rank">
                      <span className="scorer-name">{student.name}</span>
                      <span className="scorer-badge-rank">Rank #{student.rank}</span>
                    </div>
                    <div className="scorer-details-text">
                      <span>{student.department}</span>
                      <span>•</span>
                      <span>GPA: {student.gpa.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <style>{`
        .dashboard-wrapper {
          background: linear-gradient(to bottom right, #0f172a, #1e293b);
          min-height: 100vh;
          color: #e2e8f0;
        }

        .dashboard-header-section {
          padding: 32px 24px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-bottom: 1px solid #334155;
        }

        .header-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .header-title {
          font-size: 32px;
          font-weight: bold;
          color: #f1f5f9;
          margin: 0;
        }

        .header-subtitle {
          color: #94a3b8;
          margin: 8px 0 0 0;
        }

        .dashboard-content {
          padding: 32px 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: linear-gradient(to bottom right, #1e293b, #0f172a);
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: #64748b;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .stat-card.at-risk-state {
          background: linear-gradient(to bottom right, #7f1d1d, #450a0a);
          border: 2px solid #dc2626;
          box-shadow: 0 0 20px rgba(220, 38, 38, 0.2);
        }

        .stat-card.at-risk-state:hover {
          border-color: #ef4444;
          box-shadow: 0 0 30px rgba(220, 38, 38, 0.4);
        }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .stat-card-title {
          font-size: 14px;
          font-weight: 600;
          color: #cbd5e1;
          margin: 0;
        }

        .stat-card-icon {
          width: 20px;
          height: 20px;
          color: #94a3b8;
        }

        .stat-card-icon.risk-icon {
          color: #ef4444;
          animation: pulse-warning 2s infinite;
        }

        @keyframes pulse-warning {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .stat-card-value {
          font-size: 36px;
          font-weight: bold;
          color: #f1f5f9;
          margin-bottom: 8px;
        }

        .stat-card-value.risk-value {
          color: #fca5a5;
        }

        .stat-card-subtitle {
          font-size: 13px;
          color: #94a3b8;
        }

        .risk-indicator {
          color: #fca5a5;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .safe-indicator {
          color: #86efac;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .chart-card {
          background: linear-gradient(to bottom right, #1e293b, #0f172a);
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .chart-card.lg-span {
          grid-column: span 2;
        }

        .chart-card:hover {
          border-color: #64748b;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .chart-card-title {
          font-size: 18px;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0 0 8px 0;
        }

        .chart-card-desc {
          font-size: 13px;
          color: #94a3b8;
          margin: 0 0 16px 0;
        }

        .dashboard-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(to bottom right, #0f172a, #1e293b);
          color: #e2e8f0;
          font-size: 18px;
        }
      `}</style>
    </div>

  )
}
