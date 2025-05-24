import { useState, useEffect } from 'react';
import axios from 'axios';

const useBacklog = (authenticated, projectKey) => {
    const [userProjects, setUserProjects] = useState([]);
    const [jiraProjects, setJiraProjects] = useState([]);
    const [backlog, setBacklog] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // New loading state
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (authenticated) {
            const fetchAllProjects = async () => {
                setLoading(true); // Start loading
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"}/api/project/`,
                        { withCredentials: true }
                    );
                    setUserProjects(response.data);
                    setError(null);
                } catch (err) {
                    setError(err.response?.data?.error || 'Error fetching projects');
                } finally {
                    setLoading(false); // Stop loading regardless of success or failure
                }
            };
            fetchAllProjects();
        } else {
            setLoading(false); // Reset loading if not authenticated
        }
    }, [authenticated]);

    useEffect(() => {
        if (authenticated && projectKey) {
            const fetchProject = async () => {
                setLoading(true); // Start loading
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"}/api/project/key/${projectKey}`,
                        { withCredentials: true }
                    );
                    console.log("response.data", response.data)
                    setSelectedProject(response.data);
                    setError(null);
                } catch (err) {
                    setError(err.response?.data?.error || 'Error fetching project');
                } finally {
                    setLoading(false); // Stop loading regardless of success or failure
                }
            };
            fetchProject();
        } else {
            setLoading(false); // Reset loading if no projectKey or not authenticated
        }
    }, [authenticated, projectKey]);

    useEffect(() => {
        if (authenticated) {
            const fetchProjects = async () => {
                setLoading(true); // Start loading
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"}/api/backlog/projects`,
                        { withCredentials: true }
                    );
                    setJiraProjects(response.data.projects);
                    setError(null);
                } catch (err) {
                    setError(err.response?.data?.error || 'Error fetching projects');
                } finally {
                    setLoading(false); // Stop loading regardless of success or failure
                }
            };
            fetchProjects();
        } else {
            setLoading(false); // Reset loading if not authenticated
        }
    }, [authenticated]);

    useEffect(() => {
        if (authenticated && projectKey) {
            const fetchBacklog = async () => {
                setLoading(true); // Start loading
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:3001"}/api/backlog?project=${projectKey}`,
                        { withCredentials: true }
                    );
                    if (!response.data?.issues) throw new Error('Invalid response format');
                    console.log("response.data.issues", response.data.issues);
                    setBacklog(response.data.issues);
                    setError(null);
                } catch (err) {
                    setError(err.response?.data?.error || 'Error fetching backlog');
                } finally {
                    setLoading(false); // Stop loading regardless of success or failure
                }
            };
            fetchBacklog();
        } else {
            setLoading(false); // Reset loading if no projectKey or not authenticated
        }
    }, [authenticated, projectKey]);

    return { jiraProjects, userProjects, backlog, setBacklog, error, setError, loading, selectedProject };
};

export default useBacklog;