import React from 'react';
import { Container, Header } from '@cloudscape-design/components';
import { Project } from '../types';

interface GanttChartProps {
  project: Project;
}

export const GanttChart: React.FC<GanttChartProps> = ({ project }) => {
  return (
    <Container header={<Header variant="h2">Project Timeline</Header>}>
      <div>
        <p>Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
        <p>End Date: {new Date(project.endDate).toLocaleDateString()}</p>
      </div>
    </Container>
  );
};

export default GanttChart; 