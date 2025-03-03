import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  Table,
  Button,
  SpaceBetween,
} from '@cloudscape-design/components';
import { Project } from '../types';
import { ProjectService } from '../services/ProjectService';

export const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const projectService = new ProjectService();
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      header={
        <Header
          variant="h1"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => {}}>Import from TPM</Button>
              <Button onClick={() => {}}>Export to JIRA</Button>
              <Button variant="primary" onClick={() => {}}>
                New Project
              </Button>
            </SpaceBetween>
          }
        >
          Projects
        </Header>
      }
    >
      <Table
        loading={loading}
        items={projects}
        columnDefinitions={[
          {
            id: 'name',
            header: 'Project Name',
            cell: item => item.name
          },
          {
            id: 'phase',
            header: 'Phase',
            cell: item => item.phase
          },
          {
            id: 'startDate',
            header: 'Start Date',
            cell: item => item.startDate
          },
          {
            id: 'endDate',
            header: 'End Date',
            cell: item => item.endDate
          }
        ]}
      />
    </Container>
  );
}; 