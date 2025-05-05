const express = require('express');
const router = express.Router();

// Mock data for the dashboard
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
  }
};

// Route to get dashboard data
router.get('/', (req, res) => {
  try {
    console.log('Dashboard data requested');
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

// Route to download sustainability report
router.get('/download-report', (req, res) => {
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
});

module.exports = router; 