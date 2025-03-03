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
import { ProjectPhase, Project } from '../types';

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

  const timelineData: { x: Date; y: number; title: string; value: number }[] = projects.map(project => ({
    x: new Date(project.startDate),
    y: 1,
    title: project.name,
    value: 1
  }));

  return (
    <Container
      header={
        <Header variant="h1">Project Reports & Analytics</Header>
      }
    >
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
        <Container
          header={
            <Header variant="h2">Projects by Phase</Header>
          }
        >
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

        {/* Project Timeline */}
        <Container
          header={
            <Header variant="h2">Project Timelines</Header>
          }
        >
          <BarChart
            series={[{ title: "Duration (days)", type: "bar", data: timelineData }]}
            xDomain={timelineData.map(d => d.x)}
            yDomain={[0, Math.max(...timelineData.map(d => d.value))]}
            hideFilter
            xTitle="Projects"
            yTitle="Duration"
          />
        </Container>

        {/* Resource Utilization */}
        <Container
          header={
            <Header variant="h2">Resource Utilization</Header>
          }
        >
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
        <Container
          header={
            <Header variant="h2">Recent Project Updates</Header>
          }
        >
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
                  id: "progress",
                  header: "Progress",
                  content: item => `${calculateProgress(item)}%`
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

// Helper function to calculate project progress
const calculateProgress = (project: Project) => {
  const start = new Date(project.startDate).getTime();
  const end = new Date(project.endDate).getTime();
  const now = Date.now();

  if (now <= start) return 0;
  if (now >= end) return 100;

  return Math.round(((now - start) / (end - start)) * 100);
};

export default Reports; 