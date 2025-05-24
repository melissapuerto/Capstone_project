// Default data for sustainability metrics
export const sustainabilityData = {
    carbonReduction: "2.5 tons",
    treesSaved: 150,
    energySaved: "45,000 kWh",
    waterConserved: "120,000 L",
    greenCodeImpact: "85%",
    projects: [
        {
            _id: 1,
            projectName: "Green Code Optimization",
            createdAt: "2024-03-01",
            impactScore: "High",
            status: "Active",
        },
        {
            _id: 2,
            projectName: "Energy-Efficient Algorithms",
            createdAt: "2024-03-15",
            impactScore: "Medium",
            status: "Completed",
        },
        {
            _id: 3,
            projectName: "Sustainable Data Centers",
            createdAt: "2024-04-01",
            impactScore: "High",
            status: "In Progress",
        },
    ],
};

// Chart data for monthly impact
export const monthlyImpactData = [
    {
        id: "Carbon Reduction",
        data: [
            { x: "Jan", y: 1.2 },
            { x: "Feb", y: 1.5 },
            { x: "Mar", y: 1.8 },
            { x: "Apr", y: 2.0 },
            { x: "May", y: 2.2 },
            { x: "Jun", y: 2.5 },
        ],
    },
    {
        id: "Energy Saved",
        data: [
            { x: "Jan", y: 30000 },
            { x: "Feb", y: 35000 },
            { x: "Mar", y: 38000 },
            { x: "Apr", y: 40000 },
            { x: "May", y: 42000 },
            { x: "Jun", y: 45000 },
        ],
    },
];

// Chart data for impact distribution
export const impactDistributionData = [
    {
        id: "Code Optimization",
        label: "Code Optimization",
        value: 35,
        color: "#2ecc71",
    },
    {
        id: "Energy Efficiency",
        label: "Energy Efficiency",
        value: 25,
        color: "#3498db",
    },
    {
        id: "Resource Usage",
        label: "Resource Usage",
        value: 20,
        color: "#9b59b6",
    },
    {
        id: "Carbon Footprint",
        label: "Carbon Footprint",
        value: 20,
        color: "#e74c3c",
    },
];

// Chart data for resource usage
export const resourceUsageData = [
    {
        category: "CPU Usage",
        before: 85,
        after: 45,
    },
    {
        category: "Memory Usage",
        before: 75,
        after: 40,
    },
    {
        category: "Network Traffic",
        before: 90,
        after: 50,
    },
    {
        category: "Storage Usage",
        before: 80,
        after: 35,
    },
]; 