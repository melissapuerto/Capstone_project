const express = require('express');
const router = express.Router();

// Mock data for the dashboard
<<<<<<< HEAD
const dashboardData = {
  totalProjects: 8,
  activeProjects: 5,
  codeOptimization: "78%",
  carbonReduction: "1,200 kg",
  projects: [
    {
      id: 1,
      name: "Code Optimization Initiative",
      category: "Green Coding",
      storyPoints: 13,
      impactScore: 85,
      status: "In Progress"
    },
    {
      id: 2,
      name: "Legacy Code Refactoring",
      category: "Performance",
      storyPoints: 8,
      impactScore: 75,
      status: "Completed"
    },
    {
      id: 3,
      name: "API Response Optimization",
      category: "Energy Efficiency",
      storyPoints: 5,
      impactScore: 90,
      status: "In Progress"
    },
    {
      id: 4,
      name: "Database Query Optimization",
      category: "Performance",
      storyPoints: 8,
      impactScore: 82,
      status: "In Review"
    },
    {
      id: 5,
      name: "Cloud Resource Optimization",
      category: "Resource Efficiency",
      storyPoints: 13,
      impactScore: 88,
      status: "In Progress"
    }
  ],
  impactByCategory: {
    "Green Coding": 35,
    "Performance": 25,
    "Energy Efficiency": 20,
    "Resource Efficiency": 20
  },
  monthlyTrends: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    storyPoints: [15, 25, 30, 35, 45],
    energySavings: [100, 250, 400, 600, 800]
  },
  sustainabilityMetrics: {
    codeOptimization: {
      current: 78,
      previous: 65,
      trend: "up"
    },
    energyEfficiency: {
      current: 82,
      previous: 75,
      trend: "up"
    },
    resourceUtilization: {
      current: 85,
      previous: 80,
      trend: "up"
    }
=======
const mockDashboardData = {
  totalProjects: 12,
  carbonReduction: "2,500 kg",
  monthlyImpact: "85%",
  yearlyImpact: "92%",
  projects: [
    {
      _id: "1",
      projectName: "Solar Panel Installation",
      createdAt: "2024-03-01",
      impactScore: "High",
      status: "In Progress"
    },
    {
      _id: "2",
      projectName: "Waste Management System",
      createdAt: "2024-03-05",
      impactScore: "Medium",
      status: "Planning"
    },
    {
      _id: "3",
      projectName: "Energy Efficiency Audit",
      createdAt: "2024-03-10",
      impactScore: "High",
      status: "Completed"
    }
  ],
  impactByCategory: {
    "Energy": 35,
    "Waste": 25,
    "Water": 20,
    "Transport": 20
>>>>>>> 4a57146cb84e964552fe4ec7ff7ecd9f7ab4caa7
  }
};

// Route to get dashboard data
router.get('/', (req, res) => {
<<<<<<< HEAD
  try {
    console.log('Dashboard data requested');
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
=======
  res.json(mockDashboardData);
>>>>>>> 4a57146cb84e964552fe4ec7ff7ecd9f7ab4caa7
});

// Route to download sustainability report
router.get('/download-report', (req, res) => {
<<<<<<< HEAD
  try {
    // Generate CSV data
    const csvHeader = 'Project Name,Category,Story Points,Impact Score,Status,Energy Savings (kWh),Carbon Reduction (kg)\n';
    const csvRows = dashboardData.projects.map(project => {
      const energySavings = Math.floor(Math.random() * 1000) + 500; // Random value between 500-1500 kWh
      const carbonReduction = Math.floor(energySavings * 0.4); // Approximate CO2 reduction
      return `"${project.name}","${project.category}",${project.storyPoints},${project.impactScore},"${project.status}",${energySavings},${carbonReduction}`;
    }).join('\n');

    const csvString = csvHeader + csvRows;

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=sustainability_report.csv');

    // Send the CSV data
    res.send(csvString);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Error generating sustainability report' });
  }
=======
  // Create a CSV string with the dashboard data
  const csvData = [
    ['Project Name', 'Created At', 'Impact Score', 'Status'],
    ...mockDashboardData.projects.map(project => [
      project.projectName,
      project.createdAt,
      project.impactScore,
      project.status
    ])
  ].map(row => row.join(',')).join('\n');

  // Set headers for file download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=sustainability-report.csv');
  
  // Send the CSV data
  res.send(csvData);
>>>>>>> 4a57146cb84e964552fe4ec7ff7ecd9f7ab4caa7
});

module.exports = router; 