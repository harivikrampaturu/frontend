import React from 'react';
import {
  Container,
  Header,
  ColumnLayout,
  Box,
  SpaceBetween,
  BarChart,
  PieChart,
  Cards,
  Link
} from '@cloudscape-design/components';
import { useProjects } from '../hooks/useProjects';
import { ProjectPhase } from '../types';

export const Reports: React.FC = () => {
  const { projects, loading } = useProjects();

  // Calculate project metrics
  const totalProjects = projects.length;
  const projectsByPhase = Object.values(ProjectPhase).map(phase => ({
    title: phase,
    value: projects.filter(p => p.phase === phase).length
  }));

  const resourceUtilization = projects
    .flatMap(p => p.resources || [])
    .reduce((acc, resource) => {
      acc[resource.resourceId] = (acc[resource.resourceId] || 0) + resource.percentage;
      return acc;
    }, {} as Record<string, number>);

  return (
    <Container header={<Header variant="h1">Project Reports & Analytics</Header>}>
      <SpaceBetween size="l">
        {/* Key Metrics */}
        <ColumnLayout columns={3} variant="text-grid">
          <Box variant="awsui-key-label">
            <SpaceBetween size="s">
              <div>Total Projects</div>
              <Box variant="h2">{totalProjects}</Box>
            </SpaceBetween>
          </Box>
          <Box variant="awsui-key-label">
            <SpaceBetween size="s">
              <div>Active Projects</div>
              <Box variant="h2">
                {projects.filter(p => p.phase !== ProjectPhase.COMPLETED).length}
              </Box>
            </SpaceBetween>
          </Box>
          <Box variant="awsui-key-label">
            <SpaceBetween size="s">
              <div>Completed Projects</div>
              <Box variant="h2">
                {projects.filter(p => p.phase === ProjectPhase.COMPLETED).length}
              </Box>
            </SpaceBetween>
          </Box>
        </ColumnLayout>

        {/* Project Phase Distribution */}
        <Container header={<Header variant="h2">Projects by Phase</Header>}>
          <PieChart
            data={projectsByPhase}
            detailPopoverContent={(datum, sum) => [
              { key: "Projects", value: datum.value },
              { key: "Percentage", value: `${((datum.value / sum) * 100).toFixed(1)}%` }
            ]}
            size="medium"
            hideFilter
          />
        </Container>

        {/* Resource Utilization */}
        <Container header={<Header variant="h2">Resource Utilization</Header>}>
          <BarChart
            series={[{
              title: "Allocation %",
              type: "bar",
              data: Object.entries(resourceUtilization).map(([id, value]) => ({
                x: id,
                y: value,
                title: id
              }))
            }]}
            hideFilter
            yDomain={[0, 100]}
          />
        </Container>

        {/* Recent Updates */}
        <Container header={<Header variant="h2">Recent Project Updates</Header>}>
          <Cards
            items={projects.slice(0, 5)}
            loading={loading}
            cardDefinition={{
              header: item => (
                <Link href={`/projects/${item.id}`}>{item.name}</Link>
              ),
              sections: [
                {
                  id: "phase",
                  header: "Current Phase",
                  content: item => item.phase
                },
                {
                  id: "timeline",
                  header: "Timeline",
                  content: item => `${item.startDate} - ${item.endDate}`
                }
              ]
            }}
          />
        </Container>
      </SpaceBetween>
    </Container>
  );
};

export default Reports; 