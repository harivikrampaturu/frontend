import React, { useState } from 'react';
import {
  Container,
  Header,
  Table,
  Button,
  SpaceBetween,
  Modal,
  Form,
  FormField,
  Input,
  Select
} from '@cloudscape-design/components';
import { Resource, ResourceRole } from '../types';
import { useResources } from '../hooks/useResources';
import ResourceAllocationChart from '../components/ResourceAllocationChart';
import { ResourceFilter, ResourceFilterCriteria } from '../components/ResourceFilter';
import ResourceGanttChart from '../components/ResourceGanttChart';
import { useProjects } from '../hooks/useProjects';

export const Resources: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const { resources, loading, createResource } = useResources();
  const { projects } = useProjects();

  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    role: ResourceRole.DEVELOPER,
    team: '',
    availability: 100
  });

  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);

  const handleFilterChange = (filters: ResourceFilterCriteria) => {
    const filtered = resources.filter(resource => {
      const nameMatch = !filters.name ||
        resource.name.toLowerCase().includes(filters.name.toLowerCase());
      const roleMatch = !filters.role ||
        resource.role === filters.role;
      const teamMatch = !filters.team ||
        resource.team.toLowerCase().includes(filters.team.toLowerCase());

      return nameMatch && roleMatch && teamMatch;
    });

    setFilteredResources(filtered);
  };

  return (
    <Container
      header={
        <Header
          variant="h1"
          actions={
            <Button onClick={() => setShowCreateModal(true)}>
              Add Resource
            </Button>
          }
        >
          Resources
        </Header>
      }
    >
      <SpaceBetween size="l">
        <ResourceFilter onFilterChange={handleFilterChange} />
        <Table
          loading={loading}
          items={filteredResources.length > 0 ? filteredResources : resources}
          selectedItems={selectedResource ? [selectedResource] : []}
          onSelectionChange={({ detail }) =>
            setSelectedResource(detail.selectedItems[0] as Resource)
          }
          columnDefinitions={[
            {
              id: 'name',
              header: 'Name',
              cell: item => item.name
            },
            {
              id: 'alias',
              header: 'Alias',
              cell: item => item.alias
            },
            {
              id: 'role',
              header: 'Role',
              cell: item => item.role
            },
            {
              id: 'team',
              header: 'Team',
              cell: item => item.team
            },
            {
              id: 'availability',
              header: 'Availability',
              cell: item => `${item.availability}%`
            }
          ]}
        />

        {selectedResource && (
          <SpaceBetween size="l">
            <ResourceAllocationChart resource={selectedResource} />
            <ResourceGanttChart
              resource={selectedResource}
              projects={projects}
            />
          </SpaceBetween>
        )}
      </SpaceBetween>

      <Modal
        visible={showCreateModal}
        onDismiss={() => setShowCreateModal(false)}
        header="Add Resource"
      >
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="s">
              <Button onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={async () => {
                  try {
                    await createResource(formData as Omit<Resource, 'id'>);
                    setShowCreateModal(false);
                    setFormData({
                      name: '',
                      alias: '',
                      role: ResourceRole.DEVELOPER,
                      team: '',
                      availability: 100
                    });
                  } catch (error) {
                    console.error('Failed to create resource:', error);
                  }
                }}
              >
                Create
              </Button>
            </SpaceBetween>
          }
        >
          <SpaceBetween size="m">
            <FormField label="Name">
              <Input
                value={formData.name}
                onChange={({ detail }) =>
                  setFormData(prev => ({ ...prev, name: detail.value }))
                }
              />
            </FormField>
            <FormField label="Alias">
              <Input
                value={formData.alias}
                onChange={({ detail }) =>
                  setFormData(prev => ({ ...prev, alias: detail.value }))
                }
              />
            </FormField>
            <FormField label="Role">
              <Select
                selectedOption={{ label: formData.role, value: formData.role }}
                onChange={({ detail }) =>
                  setFormData(prev => ({
                    ...prev,
                    role: detail.selectedOption.value as ResourceRole
                  }))
                }
                options={Object.values(ResourceRole).map(role => ({
                  label: role,
                  value: role
                }))}
              />
            </FormField>
            <FormField label="Team">
              <Input
                value={formData.team}
                onChange={({ detail }) =>
                  setFormData(prev => ({ ...prev, team: detail.value }))
                }
              />
            </FormField>
            <FormField label="Availability (%)">
              <Input
                type="number"
                value={formData.availability.toString()}
                onChange={({ detail }) =>
                  setFormData(prev => ({
                    ...prev,
                    availability: parseInt(detail.value) || 0
                  }))
                }
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </Modal>
    </Container>
  );
};

export default Resources; 