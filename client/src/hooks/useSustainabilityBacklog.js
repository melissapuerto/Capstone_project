import { useState, useEffect } from 'react';

const useSustainabilityBacklog = () => {
    const [sustainabilityBacklog, setSustainabilityBacklog] = useState(() => {
        const saved = localStorage.getItem('sustainabilityBacklog');
        return saved ? JSON.parse(saved) : [];
    });
    const [isEditing, setIsEditing] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dropTargetIndex, setDropTargetIndex] = useState(null);
    const [dropTargetList, setDropTargetList] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState('details');
    const [importMode, setImportMode] = useState('backlog');
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [manualIssue, setManualIssue] = useState({
        summary: '',
        description: '',
        priority: 'Medium',
        storyPoints: '',
    });

    useEffect(() => {
        localStorage.setItem('sustainabilityBacklog', JSON.stringify(sustainabilityBacklog));
    }, [sustainabilityBacklog]);

    const handleDragStart = (e, item, sourceList) => {
        if (!isEditing) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData('text/plain', JSON.stringify({ item, sourceList }));
        setDraggedItem(item);
    };

    const handleDragEnter = (e, index, list) => {
        if (!isEditing) return;
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const dropIndex = e.clientY < rect.top + rect.height / 2 ? index : index + 1;
        setDropTargetIndex(dropIndex);
        setDropTargetList(list);
    };

    const handleDragLeave = (e) => {
        if (!isEditing) return;
        e.preventDefault();
        setDropTargetIndex(null);
        setDropTargetList(null);
    };

    const handleDragOver = (e) => {
        if (!isEditing) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetList, backlog, setBacklog) => {
        if (!isEditing) return;
        e.preventDefault();
        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const { item, sourceList } = data;
            const dropIndex = dropTargetIndex !== null ? dropTargetIndex : targetList === 'backlog' ? backlog.length : sustainabilityBacklog.length;

            if (sourceList === targetList) {
                const list = sourceList === 'backlog' ? backlog : sustainabilityBacklog;
                const newList = [...list];
                const currentIndex = newList.findIndex(i => i.id === item.id);
                newList.splice(currentIndex, 1);
                newList.splice(dropIndex, 0, item);
                sourceList === 'backlog' ? setBacklog(newList) : setSustainabilityBacklog(newList);
            } else {
                if (sourceList === 'backlog' && targetList === 'sustainability') {
                    setBacklog(backlog.filter(i => i.id !== item.id));
                    setSustainabilityBacklog([...sustainabilityBacklog.slice(0, dropIndex), item, ...sustainabilityBacklog.slice(dropIndex)]);
                } else if (sourceList === 'sustainability' && targetList === 'backlog') {
                    setSustainabilityBacklog(sustainabilityBacklog.filter(i => i.id !== item.id));
                    setBacklog([...backlog.slice(0, dropIndex), item, ...backlog.slice(dropIndex)]);
                }
            }
        } catch (err) {
            console.error('Error handling drop:', err);
        }
        setDraggedItem(null);
        setDropTargetIndex(null);
        setDropTargetList(null);
    };

    const handleViewDetails = (issue) => {
        setSelectedIssue(issue);
        setDialogMode('details');
        setOpenDialog(true);
    };

    const handleAddToSustainability = (issue) => {
        if (!sustainabilityBacklog.some(item => item.id === issue.id)) {
            setSustainabilityBacklog([...sustainabilityBacklog, issue]);
        }
    };

    const handleRemoveFromSustainability = (issue) => {
        setSustainabilityBacklog(sustainabilityBacklog.filter(i => i.id !== issue.id));
    };

    const handleManualImport = (backlog, setBacklog) => {
        if (!manualIssue.summary) return;
        const fields = {
            summary: String(manualIssue.summary),
            description: String(manualIssue.description || ''),
            priority: { name: String(manualIssue.priority) },
            customfield_10016: manualIssue.storyPoints ? parseInt(manualIssue.storyPoints) : null,
            updated: new Date().toISOString(),
        };
        const newIssue = {
            id: `manual-${Date.now()}`,
            key: `MAN-${Date.now()}`,
            fields,
        };
        setBacklog([...backlog, newIssue]);
        setManualIssue({ summary: '', description: '', priority: 'Medium', storyPoints: '' });
    };

    const handleFileImport = (event, backlog, setBacklog, setError) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let issues = [];
                if (file.name.endsWith('.json')) {
                    const parsedContent = JSON.parse(content);
                    issues = (Array.isArray(parsedContent) ? parsedContent : [parsedContent]).map(item => ({
                        id: `imported-${Date.now()}-${item.id || Math.random()}`,
                        key: String(item.key || `IMPORT-${Date.now()}`),
                        fields: {
                            summary: String(item.summary || ''),
                            description: String(item.description || ''),
                            priority: { name: String(item.priority || 'Medium') },
                            customfield_10016: item.storyPoints ? parseInt(item.storyPoints) : null,
                            updated: new Date().toISOString(),
                        },
                    }));
                } else if (file.name.endsWith('.csv')) {
                    const lines = content.split('\n');
                    issues = lines.slice(1).map(line => {
                        const values = line.split(',').map(v => v.trim());
                        return {
                            id: `imported-${Date.now()}-${values[0] || Math.random()}`,
                            key: String(values[0] || `IMPORT-${Date.now()}`),
                            fields: {
                                summary: String(values[1] || ''),
                                description: String(values[2] || ''),
                                priority: { name: String(values[3] || 'Medium') },
                                customfield_10016: values[4] ? parseInt(values[4]) : null,
                                updated: new Date().toISOString(),
                            },
                        };
                    });
                }
                if (issues.length > 0) {
                    setBacklog([...backlog, ...issues]);
                    setError(null);
                } else {
                    setError('No valid issues found in the file.');
                }
            } catch (err) {
                setError('Error parsing file: ' + err.message);
            }
        };
        if (file.name.endsWith('.json') || file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else {
            setError('Unsupported file format. Please use JSON or CSV.');
        }
    };

    return {
        sustainabilityBacklog,
        setSustainabilityBacklog,
        isEditing,
        setIsEditing,
        draggedItem,
        dropTargetIndex,
        dropTargetList,
        openDialog,
        setOpenDialog,
        dialogMode,
        setDialogMode,
        importMode,
        setImportMode,
        selectedIssue,
        setSelectedIssue,
        manualIssue,
        setManualIssue,
        handleDragStart,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
        handleViewDetails,
        handleAddToSustainability,
        handleRemoveFromSustainability,
        handleManualImport,
        handleFileImport,
    };
};

export default useSustainabilityBacklog;