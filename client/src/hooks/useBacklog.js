import { useState, useEffect } from 'react';
import axios from 'axios';

const useBacklog = (authenticated, selectedProject) => {
    const [projects, setProjects] = useState([]);
    const [backlog, setBacklog] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authenticated) {
            const fetchProjects = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"}/api/backlog/projects`,
                        { withCredentials: true }
                    );
                    setProjects(response.data.projects);
                    setError(null);
                } catch (err) {
                    setError(err.response?.data?.error || 'Error fetching projects');
                }
            };
            fetchProjects();
        }
    }, [authenticated]);

    useEffect(() => {
        if (authenticated && selectedProject) {
            const fetchBacklog = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"}/api/backlog?project=${selectedProject.key}`,
                        { withCredentials: true }
                    );
                    if (!response.data?.issues) throw new Error('Invalid response format');
                    setBacklog(response.data.issues);
                    setError(null);
                } catch (err) {
                    setError(err.response?.data?.error || 'Error fetching backlog');
                }
            };
            fetchBacklog();
        }
    }, [authenticated, selectedProject]);

    return { projects, backlog, setBacklog, error, setError };
};

export default useBacklog;