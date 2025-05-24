const express = require('express');
const axios = require('axios');
const router = express.Router();

// Helper function to get cloud ID
async function getCloudId(accessToken) {
    try {
        const response = await axios.get(`https://api.atlassian.com/oauth/token/accessible-resources`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        });
        if (!response.data || !response.data[0]) {
            throw new Error('No accessible resources found');
        }
        return response.data[0].id;
    } catch (err) {
        throw new Error(`Failed to get cloud ID: ${err.message}`);
    }
}

// Helper function to get all projects
async function getAllProjects(accessToken, cloudId) {
    try {
        const response = await axios.get(
            `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json',
                },
            }
        );
        return response.data.map(project => ({
            id: project.id,
            key: project.key,
            name: project.name,
        }));
    } catch (err) {
        throw new Error(`Failed to fetch projects: ${err.message}`);
    }
}

// Helper function to validate project key
async function validateProjectKey(accessToken, cloudId, projectKey) {
    const projects = await getAllProjects(accessToken, cloudId);
    const project = projects.find(p => p.key === projectKey);
    if (!project) {
        throw new Error(`Project key "${projectKey}" not found`);
    }
    return projectKey;
}

// Route to list all accessible projects
router.get('/projects', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            error: 'Not authenticated',
            redirect: '/auth/atlassian',
        });
    }

    const { accessToken } = req.user;

    try {
        const cloudId = await getCloudId(accessToken);
        const projects = await getAllProjects(accessToken, cloudId);
        res.json({ cloudId, projects });
    } catch (err) {
        console.error('Error fetching projects:', err.message);
        res.status(500).json({
            error: 'Error fetching projects',
            details: err.message,
            redirect: '/auth/atlassian',
        });
    }
});


// Route to get sustainability-filtered backlog data for a specific project
router.get('/', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            error: 'Not authenticated',
            redirect: '/auth/atlassian',
        });
    }

    const { accessToken } = req.user;
    const projectKey = req.query.project || process.env.DEFAULT_PROJECT_KEY;

    if (!projectKey) {
        return res.status(400).json({
            error: 'Project key is required',
            details: 'Specify a project key via ?project=KEY or set DEFAULT_PROJECT_KEY in .env',
        });
    }

    try {
        const cloudId = await getCloudId(accessToken);
        // Validate project key
        await validateProjectKey(accessToken, cloudId, projectKey);

        const apiUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search`;
        const jql = `project = "${projectKey}" AND (summary ~ "sustainability" OR description ~ "sustainability" OR labels = "sustainability") ORDER BY priority DESC`;

        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
            params: {
                jql,
                fields: 'summary,priority,issuetype,customfield_10016,description,updated,labels',
            },
        });

        if (!response.data || !response.data.issues) {
            console.error('Invalid response format from Jira:', response.data);
            return res.status(500).json({ error: 'Invalid response from Jira' });
        }

        res.json({
            cloudId,
            projectKey,
            issues: response.data.issues,
        });
    } catch (err) {
        console.error('Error fetching backlog:', err.response ? {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers,
        } : err.message);
        res.status(err.message.includes('not found') ? 404 : 500).json({
            error: 'Error fetching backlog',
            details: err.response ? err.response.data : err.message,
            redirect: err.response && err.response.status === 401 ? '/auth/atlassian' : undefined,
        });
    }
});

module.exports = router;
