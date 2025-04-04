import React, { useState } from 'react';
import {
  Container,
  Header,
  Grid,
  BarChart,
  // PieChart,
  Cards,
  SpaceBetween,
  Select,
  FormField
} from '@cloudscape-design/components';
import { useProjects } from '../hooks/useProjects';
import { useResources } from '../hooks/useResources';
import { Resource } from '../types'; // ProjectPhase
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import ResourceGanttChart from '../components/ResourceGanttChart';

const Dashboard: React.FC = () => {
  const { projects = [], loading: projectsLoading } = useProjects();
  const { resources = [] } = useResources();
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  /*   const projectsByPhase = Object.values(ProjectPhase).map(phase => ({
      title: phase,
      value: projects.filter(p => p.phase === phase).length
    })); */

  const resourceUtilization = resources
    .filter(resource => {
      // If "all" is selected, check if resource has any allocations
      if (selectedProjectId === 'all') {
        return resource.allocations && resource.allocations.length > 0;
      }
      // Otherwise, check if resource is allocated to selected project
      return resource.allocations?.some(a => a.projectId === selectedProjectId);
    })
    .map(resource => {
      const totalAllocation = resource.allocations?.reduce((sum, allocation) => {
        if (selectedProjectId === 'all' || allocation.projectId === selectedProjectId) {
          return sum + (allocation.allocation || 0);
        }
        return sum;
      }, 0) || 0;

      return {
        title: resource.name,
        value: totalAllocation
      };
    })
    // Sort by allocation value in descending order and take top 10
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <Container header={<Header variant="h1">Dashboard</Header>}>
      <SpaceBetween size="l">
        {/* Stats Overview Section */}
        <Container header={<Header variant="h2">Overview</Header>}>
          <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
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
              subtitle="Resource Utilization"
              color="#ff9900"
            />
          </Grid>
        </Container>

        {/* Charts Section */}
        <Grid gridDefinition={[{ colspan: 12 }, { colspan: 12 }]}>
          {/*   <Container header={<Header variant="h2">Projects by Phase</Header>}>
            <PieChart
              data={projectsByPhase}
              detailPopoverContent={(datum, sum) => [
                { key: "Projects", value: datum.value },
                { key: "Percentage", value: `${((datum.value / sum) * 100).toFixed(1)}%` }
              ]}
              size="medium"
              hideFilter
            />
          </Container> */}

          <Container header={<Header variant="h2">Resource Allocation</Header>}>
            <SpaceBetween size="m">
              <FormField label="Filter by Project">
                <Select
                  selectedOption={
                    selectedProjectId === 'all'
                      ? { label: 'All Projects', value: 'all' }
                      : {
                        label: projects.find(p => p.id === selectedProjectId)?.name || '',
                        value: selectedProjectId
                      }
                  }
                  onChange={({ detail }) => setSelectedProjectId(detail.selectedOption.value || 'all')}
                  options={[
                    { label: 'All Projects', value: 'all' },
                    ...projects.map(project => ({
                      label: project.name,
                      value: project.id
                    }))
                  ]}
                />
              </FormField>
              <BarChart
                series={[{
                  title: "Allocation %",
                  type: "bar",
                  data: resourceUtilization.map(r => ({ x: r.title, y: r.value }))
                }]}
                xDomain={resourceUtilization.map(r => r.title)}
                yDomain={[0, 100]}
                hideFilter
                height={300}
                empty={
                  resourceUtilization.length === 0
                    ? "No resources allocated to this project"
                    : undefined
                }
              />
            </SpaceBetween>
          </Container>
        </Grid>

        {/* Resource Timeline Section */}
        <Container header={<Header variant="h2">Resource Timeline</Header>}>
          <SpaceBetween size="m">
            <FormField label="Select Team Member">
              <Select
                selectedOption={
                  selectedResource
                    ? { label: selectedResource.name, value: selectedResource.id }
                    : null
                }
                onChange={({ detail }) => {
                  const resource = resources.find(r => r.id === detail.selectedOption.value);
                  setSelectedResource(resource || null);
                }}
                options={resources.map(resource => ({
                  label: resource.name,
                  value: resource.id,
                  description: `${resource.role} - ${resource.team}`
                }))}
                placeholder="Select a team member to view their timeline"
                filteringType="auto"
              />
            </FormField>

            {selectedResource && (
              <ResourceGanttChart
                resource={selectedResource}
                projects={projects}
              />
            )}
          </SpaceBetween>
        </Container>

        {/* Recent Projects Section */}
        <Container header={<Header variant="h2">Recent Projects</Header>}>
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
                  content: item => `${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}`
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