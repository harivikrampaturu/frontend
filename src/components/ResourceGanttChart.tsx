import React, { useEffect, useRef } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import {
    Container,
    Header,
    SpaceBetween,
} from '@cloudscape-design/components';
import { Resource, Project } from '../types';

interface ResourceGanttChartProps {
    resource: Resource;
    projects: Project[];
}

export const ResourceGanttChart: React.FC<ResourceGanttChartProps> = ({ resource, projects }) => {
    const ganttContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ganttContainer.current) return;

        // Configure gantt
        gantt.config.date_format = "%Y-%m-%d";
        gantt.config.readonly = true;
        gantt.config.columns = [
            { name: "text", label: "Project", tree: true, width: 200 },
            { name: "allocation", label: "Allocation", width: 80 },
            { name: "phase", label: "Phase", width: 80 }
        ];

        // Custom task background based on allocation
        gantt.templates.task_class = (_start, _end, task) => {
            return task.allocation > 80 ? "high-allocation" : "normal-allocation";
        };

        // Initialize gantt in the container
        gantt.init(ganttContainer.current);

        // Prepare data for gantt
        const tasks = {
            data: projects.filter(project => {
                const allocation = project.resources?.find(r => r.resourceId === resource.id);
                return allocation?.allocation && allocation.allocation > 0;
            }).map(project => {
                const allocation = project.resources?.find(r => r.resourceId === resource.id);
                return {
                    id: project.id,
                    text: project.name,
                    start_date: new Date(project.startDate),
                    end_date: new Date(project.endDate),
                    allocation: allocation?.allocation || 0,
                    phase: project.phase,
                    progress: allocation ? allocation.allocation / 100 : 0
                };
            })
        };

        // Load data
        gantt.parse(tasks);

        // Cleanup
        return () => {
            gantt.clearAll();
        };
    }, [resource, projects]);

    // Add custom styles
    const customStyles = `
        .gantt_task_line.high-allocation {
            background-color: #ff8888;
        }
        .gantt_task_line.normal-allocation {
            background-color: #65c16f;
        }
        .gantt_container {
            height: 400px;
            width: 100%;
        }
    `;

    return (
        <Container
            header={
                <Header variant="h2">
                    Resource Timeline - {resource.name}
                </Header>
            }
        >
            <SpaceBetween size="l">
                <style>{customStyles}</style>
                <div ref={ganttContainer} />
            </SpaceBetween>
        </Container>
    );
};

export default ResourceGanttChart; 