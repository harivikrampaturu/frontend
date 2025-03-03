import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Header, SpaceBetween, Button, Table } from '@cloudscape-design/components';
import { Project } from '../types';
import GanttChart from '../components/GanttChart';
import { useNotifications } from '../contexts/NotificationContext';
// import { ResourceManagement } from '../components/ResourceManagement';

interface ProjectReport {
    metrics: {
        resourceUtilization: number;
        timelineDeviation: number;
        resourceCount: number;
    };
    risks: string[];
    recommendations: string[];
}

export const ProjectDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const { addNotification } = useNotifications();
    const [projectReport, setProjectReport] = useState<ProjectReport | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProject(data);
            } catch (error) {
                addNotification({
                    type: 'error',
                    content: `Failed to load project: ${error instanceof Error ? error.message : 'Unknown error'}`
                });
                navigate('/projects');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    useEffect(() => {
        const fetchProjectReport = async () => {
            if (!project) {
                setProjectReport(null);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/project/${project.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch project report');
                }
                const data = await response.json();
                setProjectReport(data);
            } catch (error) {
                console.error('Error fetching project report:', error);
                // addNotification({
                //     type: 'error',
                //     content: 'Failed to load project report'
                // });
            }
        };

        fetchProjectReport();
    }, [project]);

    if (loading) return <div>Loading...</div>;
    if (!project) return <div>Project not found</div>;

    return (
        <Container
            header={
                <Header
                    variant="h1"
                    actions={
                        <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
                    }
                >
                    {project.name}
                </Header>
            }
        >
            <SpaceBetween size="l">
                {/* Project details */}
                <Container header={<Header variant="h2">Project Details</Header>}>
                    <Table
                        columnDefinitions={[
                            { id: 'attribute', header: 'Attribute', cell: item => item.label },
                            { id: 'value', header: 'Value', cell: item => item.value }
                        ]}
                        items={[
                            { label: 'Phase', value: project.phase },
                            { label: 'Start Date', value: project.startDate },
                            { label: 'End Date', value: project.endDate },
                            { label: 'Description', value: project.description }
                        ]}
                        variant="container"
                    />
                </Container>

                {/* Add ResourceManagement component */}
                {/* <ResourceManagement
                    projectId={id}
                    onResourceAssigned={() => {
                        addNotification({
                            type: 'success',
                            content: 'Resource assigned successfully'
                        });
                    }}
                />

                {/* Project Report */}
                <Container header={<Header variant="h2">Project Report</Header>}>
                    {projectReport ? (
                        <SpaceBetween size="m">
                            <Table
                                columnDefinitions={[
                                    { id: 'metric', header: 'Metric', cell: item => item.label },
                                    { id: 'value', header: 'Value', cell: item => item.value }
                                ]}
                                items={[
                                    { label: 'Resource Utilization', value: `${projectReport.metrics.resourceUtilization}%` },
                                    // { label: 'Phase Progress', value: `${projectReport.metrics.phaseProgress}%` },
                                    { label: 'Timeline Deviation', value: `${projectReport.metrics.timelineDeviation} days` },
                                    { label: 'Resource Count', value: projectReport.metrics.resourceCount },
                                    // { label: 'Total Tasks', value: projectReport.metrics.totalTasks },
                                    // { label: 'Completed Tasks', value: projectReport.metrics.completedTasks }
                                ]}
                            />

                            <div>
                                <h3>Risks:</h3>
                                <ul>
                                    {projectReport.risks.map((risk: string, index: number) => (
                                        <li key={index}>{risk}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3>Recommendations:</h3>
                                <ul>
                                    {projectReport.recommendations.map((rec: string, index: number) => (
                                        <li key={index}>{rec}</li>
                                    ))}
                                </ul>
                            </div>
                        </SpaceBetween>
                    ) : (
                        <div>Loading project report...</div>
                    )}
                </Container>

                {/* Gantt Chart */}
                <GanttChart project={project} />
            </SpaceBetween>
        </Container>
    );
};

export default ProjectDetails; 