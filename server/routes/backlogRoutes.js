const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to get JIRA product backlog data
router.get('/', async (req, res) => {
    if (!req.user) {
        return res.status(401).send('Not authenticated');
    }

    const user = req.user;

    try {
        // Get the cloud ID to access the correct JIRA site
        const cloudIdResponse = await axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
                'Accept': 'application/json'
            }
        });

        const cloudId = cloudIdResponse.data[0].id;  // Assuming the first result is your site
        console.log('Cloud ID:', cloudId);

        // Construct the URL for accessing the product backlog
        const apiUrl = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search`;

        // Fetch the product backlog from JIRA using the access token and cloud ID
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
                'Accept': 'application/json'
            },
            params: {
                jql: 'project = "SCRUM" ORDER BY priority DESC',
                fields: 'summary,priority,issuetype'
            }
        });
        res.json(response.data);
    } catch (err) {
        console.error('Error fetching backlog:', err.response ? err.response.data : err.message);
        res.status(500).send('Error fetching backlog');
    }
});

module.exports = router;
