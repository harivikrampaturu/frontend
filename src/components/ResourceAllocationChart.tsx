import React from 'react';
import {
  Container,
  Header,
  BarChart,
  Box,
  SpaceBetween
} from '@cloudscape-design/components';
import { Resource, Project } from '../types';
import { useProjects } from '../hooks/useProjects';

interface ResourceAllocationChartProps {
  resource: Resource;
}

export const ResourceAllocationChart: React.FC<ResourceAllocationChartProps> = ({ resource }) => {
  const { projects } = useProjects();

  const getAllocationsData = () => {
    const allocations = projects.flatMap((project: Project) => 
      project.resources.filter(allocation => 
        allocation.resourceId === resource.id
      )
    );

    return allocations.map(allocation => ({
      title: projects.find(p => p.id === allocation.projectId)?.name || '',
      value: allocation.percentage,
      color: getColorForProject(allocation.projectId)
    }));
  };

  const getColorForProject = (projectId: string) => {
    // Generate consistent colors for projects
    const colors = ['#0073bb', '#ec7211', '#d13212', '#00a1c9'];
    const index = projectId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  return (
    <Container
      header={
        <Header variant="h2">
          Resource Allocation
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Box>
          <BarChart
            series={[
              {
                title: "Project Allocation",
                type: "bar",
                data: getAllocationsData()
              }
            ]}
            xDomain={getAllocationsData().map(d => d.title)}
            yDomain={[0, 100]}
            hideFilter
            hideLegend
            height={300}
          />
        </Box>
        <Box>
          Total Allocation: {getAllocationsData().reduce((acc, curr) => acc + curr.value, 0)}%
        </Box>
      </SpaceBetween>
    </Container>
  );
};

export default ResourceAllocationChart; 