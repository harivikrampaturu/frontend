import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
} from '@cloudscape-design/components';
import { useResources } from '../hooks/useResources';
import { useProjects } from '../hooks/useProjects';
import ResourceAllocationChart from '../components/ResourceAllocationChart';
import ResourceGanttChart from '../components/ResourceGanttChart';

export const ResourceDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resources } = useResources();
  const { projects } = useProjects();
  
  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return <div>Resource not found</div>;
  }

  return (
    <Container
      header={
        <Header
          variant="h1"
          actions={
            <Button onClick={() => navigate('/resources')}>
              Back to Resources
            </Button>
          }
        >
          {resource.name}
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ResourceAllocationChart resource={resource} />
        <ResourceGanttChart
          resource={resource}
          projects={projects}
        />
      </SpaceBetween>
    </Container>
  );
};

export default ResourceDetails;
