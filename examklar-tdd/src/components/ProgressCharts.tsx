// 🟢 GREEN PHASE: Minimal implementation to make tests pass
import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export interface ProgressChartsData {
  weeklyStudyHours: Array<{ day: string; hours: number }>
  subjectProgress: Array<{ subject: string; completed: number; total: number }>
  monthlyTrend: Array<{ month: string; hours: number }>
}

export interface ProgressChartsProps {
  data: ProgressChartsData
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ data }) => {
  // Provide default data if empty to ensure charts always render
  const chartData = {
    weeklyStudyHours: data.weeklyStudyHours.length > 0 ? data.weeklyStudyHours : [
      { day: 'Mon', hours: 0 },
      { day: 'Tue', hours: 0 },
      { day: 'Wed', hours: 0 },
      { day: 'Thu', hours: 0 },
      { day: 'Fri', hours: 0 },
      { day: 'Sat', hours: 0 },
      { day: 'Sun', hours: 0 },
    ],
    subjectProgress: data.subjectProgress.length > 0 ? data.subjectProgress : [
      { subject: 'No Data', completed: 0, total: 1 }
    ],
    monthlyTrend: data.monthlyTrend.length > 0 ? data.monthlyTrend : [
      { month: 'Current', hours: 0 }
    ]
  }

  // Prepare chart data
  const weeklyChartData = {
    labels: chartData.weeklyStudyHours.map(item => item.day),
    datasets: [
      {
        label: 'Hours Studied',
        data: chartData.weeklyStudyHours.map(item => item.hours),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }

  const subjectChartData = {
    labels: chartData.subjectProgress.map(item => item.subject),
    datasets: [
      {
        data: chartData.subjectProgress.map(item => (item.completed / item.total) * 100),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const monthlyChartData = {
    labels: chartData.monthlyTrend.map(item => item.month),
    datasets: [
      {
        label: 'Study Hours',
        data: chartData.monthlyTrend.map(item => item.hours),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  return (
    <div 
      data-testid="progress-charts-container"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {/* Weekly Study Hours Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Weekly Study Hours</h3>
        <p className="text-sm text-gray-600 mb-4">Track your daily study patterns</p>
        <div 
          data-testid="weekly-study-chart"
          aria-label="Weekly study hours bar chart"
          className="h-64"
        >
          <Bar data={weeklyChartData} options={chartOptions} />
        </div>
      </div>

      {/* Subject Progress Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Subject Progress</h3>
        <p className="text-sm text-gray-600 mb-4">See completion rates by subject</p>
        <div 
          data-testid="subject-progress-chart"
          aria-label="Subject progress pie chart"
          className="h-64"
        >
          <Pie data={subjectChartData} options={chartOptions} />
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border md:col-span-2 lg:col-span-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Monthly Study Trend</h3>
        <p className="text-sm text-gray-600 mb-4">View your learning journey over time</p>
        <div 
          data-testid="monthly-trend-chart"
          aria-label="Monthly study trend line chart"
          className="h-64"
        >
          <Line data={monthlyChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}
