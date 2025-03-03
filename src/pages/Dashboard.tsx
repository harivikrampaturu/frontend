import React from 'react';
import {
  Container,
  Header,
  Grid,
  Box,
  BarChart,
  PieChart,
  Cards,
  SpaceBetween
} from '@cloudscape-design/components';
import { useProjects } from '../hooks/useProjects';
import { useResources } from '../hooks/useResources';
import { ProjectPhase } from '../types';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';

const Dashboard: React.FC = () => {
  const { projects = [], loading: projectsLoading } = useProjects();
  const { resources = [] } = useResources();

  const projectsByPhase = Object.values(ProjectPhase).map(phase => ({
    title: phase,
    value: projects.filter(p => p.phase === phase).length
  }));

  const resourceUtilization = resources.map(resource => {
    // Get allocations directly from the resource if they exist
    const totalAllocation = resource.allocations?.reduce(
      (sum: number, allocation: { allocation: number }) => sum + allocation.allocation,
      0
    ) || 0;

    return {
      title: resource.name,
      value: totalAllocation
    };
  });

  return (
    <Container
      header={
        <Header variant="h1">Dashboard</Header>
      }
    >
      <SpaceBetween size="l">
        {/* Project Statistics */}
        <Grid
          gridDefinition={[
            { colspan: 4 },
            { colspan: 4 },
            { colspan: 4 }
          ]}
        >
          <StatCard
            title="Total Projects"
            value={projects.length}
            subtitle="Active Projects"
            color="#16db65"
          />
          <StatCard
            title="Active Resources"
            value={resources.length}
            subtitle="Team Members"
            color="#0066ff"
          />
          <StatCard
            title="Average Utilization"
            value={`${Math.round(
              resourceUtilization.reduce((sum, r) => sum + r.value, 0) /
              resources.length || 0
            )}%`}
            subtitle="Resource Usage"
            color="#ff4d4d"
          />
        </Grid>

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

        {/* Resource Utilization */}
        <Container
          header={
            <Header variant="h2">Resource Utilization</Header>
          }
        >
          <BarChart
            series={[{
              title: "Allocation",
              type: "bar",
              data: resourceUtilization.map(r => ({ x: r.title, y: r.value }))
            }]}
            xDomain={resourceUtilization.map(r => r.title)}
            yDomain={[0, 100]}
            hideFilter
            height={300}
          />
        </Container>

        {/* Recent Projects */}
        <Container
          header={
            <Header variant="h2">Recent Projects</Header>
          }
        >
          <Cards
            items={projects.slice(0, 5)}
            loading={projectsLoading}
            cardDefinition={{
              header: item => (
                <Link to={`/projects/${item.id}`}>{item.name}</Link>
              ),
              sections: [
                {
                  id: "phase",
                  header: "Phase",
                  content: item => item.phase
                },
                {
                  id: "dates",
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

export default Dashboard; 