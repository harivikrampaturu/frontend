import React from 'react';
import {
  Container,
  Header,
  ColumnLayout,
  Box,
  LineChart,
  PieChart,
  Cards,
  SpaceBetween
} from '@cloudscape-design/components';
import { Project, Resource, ProjectPhase } from '../types';

interface ProjectAnalyticsProps {
  projects: Project[];
  resources: Resource[];
}

export const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({
  projects
}) => {
  // Calculate project metrics
  const calculateMetrics = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.phase !== ProjectPhase.MAINTENANCE).length;
    const avgDuration = projects.reduce((sum, p) => {
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    }, 0) / totalProjects;

    return {
      totalProjects,
      activeProjects,
      avgDuration: Math.round(avgDuration)
    };
  };

  // Calculate phase distribution
  const getPhaseDistribution = () => {
    return Object.values(ProjectPhase).map(phase => ({
      title: phase,
      value: projects.filter(p => p.phase === phase).length
    }));
  };

  // Calculate resource allocation trends
  const getAllocationTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      x: month,
      y: Math.random() * 100 // Replace with actual historical data
    }));
  };

  const metrics = calculateMetrics();

  return (
    <Container
      header={
        <Header variant="h2">Project Analytics</Header>
      }
    >
      <SpaceBetween size="l">
        {/* Key Metrics */}
        <ColumnLayout columns={3} variant="text-grid">
          <Box textAlign="center">
            <Box variant="h3">Total Projects</Box>
            <Box variant="awsui-key-label">{metrics.totalProjects}</Box>
          </Box>
          <Box textAlign="center">
            <Box variant="h3">Active Projects</Box>
            <Box variant="awsui-key-label">{metrics.activeProjects}</Box>
          </Box>
          <Box textAlign="center">
            <Box variant="h3">Avg Duration (days)</Box>
            <Box variant="awsui-key-label">{metrics.avgDuration}</Box>
          </Box>
        </ColumnLayout>

        {/* Phase Distribution */}
        <Container
          header={
            <Header variant="h3">Project Phase Distribution</Header>
          }
        >
          <PieChart
            data={getPhaseDistribution()}
            detailPopoverContent={(datum, sum) => [
              { key: "Count", value: datum.value },
              { key: "Percentage", value: `${((datum.value / sum) * 100).toFixed(1)}%` }
            ]}
            size="medium"
            hideFilter
          />
        </Container>

        {/* Resource Allocation Trends */}
        <Container
          header={
            <Header variant="h3">Resource Allocation Trends</Header>
          }
        >
          <LineChart
            series={[{
              title: "Average Allocation",
              type: "line",
              data: getAllocationTrends()
            }]}
            xDomain={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
            yDomain={[0, 100]}
            hideFilter
            height={300}
          />
        </Container>

        {/* Project Health Cards */}
        <Container
          header={
            <Header variant="h3">Project Health Overview</Header>
          }
        >
          <Cards
            items={projects.map(project => ({
              ...project,
              health: calculateProjectHealth(project)
            }))}
            cardDefinition={{
              header: item => item.name,
              sections: [
                {
                  id: "phase",
                  header: "Phase",
                  content: item => item.phase
                },
                {
                  id: "health",
                  header: "Health",
                  content: item => item.health
                },
                {
                  id: "resources",
                  header: "Resources",
                  content: item => item.resources.length
                }
              ]
            }}
          />
        </Container>
      </SpaceBetween>
    </Container>
  );
};

// Helper function to calculate project health
const calculateProjectHealth = (project: Project): string => {
  const today = new Date();
  const end = new Date(project.endDate);
  const start = new Date(project.startDate);
  const totalDuration = end.getTime() - start.getTime();
  const elapsed = today.getTime() - start.getTime();
  const progress = elapsed / totalDuration;

  const phaseIndex = Object.values(ProjectPhase).indexOf(project.phase);
  const expectedPhaseIndex = Math.floor(progress * Object.values(ProjectPhase).length);

  if (phaseIndex < expectedPhaseIndex) return 'At Risk';
  if (phaseIndex === expectedPhaseIndex) return 'On Track';
  return 'Ahead';
};

export default ProjectAnalytics; 