import React, { useEffect, useRef, useState } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { Project, ResourceAllocation, Task } from '../types';
import { Container, Header } from '@cloudscape-design/components';

interface GanttChartProps {
  project: Project;
}

export const GanttChart: React.FC<GanttChartProps> = ({ project }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!project?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${project.id}/tasks`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data || []); // Ensure we always set an array, even if empty
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [project?.id]);

  useEffect(() => {
    if (containerRef.current) {
      gantt.init(containerRef.current);

      // Configure Gantt
      gantt.config.date_format = "%Y-%m-%d";
      gantt.config.drag_links = false;
      gantt.config.drag_progress = true;

      // Custom columns
      gantt.config.columns = [
        { name: "text", label: "Task name", tree: true, width: 200 },
        { name: "start_date", label: "Start date", align: "center", width: 100 },
        { name: "end_date", label: "End date", align: "center", width: 100 },
        { name: "resource", label: "Resource", align: "center", width: 100 }
      ];

      // Load data
      const tasks = {
        data: [
          {
            id: project.id,
            text: project.name,
            start_date: project.startDate,
            end_date: project.endDate,
            progress: 0,
            open: true
          },
          ...project.resources.map((allocation: ResourceAllocation) => ({
            id: allocation.id,
            text: `Resource: ${allocation.resourceId}`,
            start_date: allocation.startDate,
            end_date: allocation.endDate,
            parent: project.id,
            progress: 0
          }))
        ]
      };

      gantt.parse(tasks);
    }

    return () => {
      gantt.clearAll();
    };
  }, [project]);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (!tasks.length) {
    return <div>No tasks found for this project.</div>;
  }

  return (
    <Container
      header={
        <Header variant="h2">Project Timeline</Header>
      }
    >
      <div
        ref={containerRef}
        style={{ height: '400px', width: '100%' }}
      />
    </Container>
  );
};

export default GanttChart; 