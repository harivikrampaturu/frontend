import React, { useState } from 'react';
import {
  Container,
  Header,
  Table,
  Button,
  Modal,
  Form,
  FormField,
  Select,
  Alert,
  SpaceBetween
} from '@cloudscape-design/components';
import { Project } from '../types';

interface Dependency {
  id: string;
  sourceProjectId: string;
  targetProjectId: string;
  type: 'BLOCKS' | 'REQUIRED_BY' | 'RELATED_TO';
  description: string;
}

interface ProjectDependenciesProps {
  project: Project;
  allProjects: Project[];
  onAddDependency: (dependency: Omit<Dependency, 'id'>) => void;
  onRemoveDependency: (dependencyId: string) => void;
}

export const ProjectDependencies: React.FC<ProjectDependenciesProps> = ({
  project,
  allProjects,
  onAddDependency,
  onRemoveDependency
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newDependency, setNewDependency] = useState({
    targetProjectId: '',
    type: 'BLOCKS',
    description: ''
  });

  const dependencyTypes = [
    { label: 'Blocks', value: 'BLOCKS' },
    { label: 'Required By', value: 'REQUIRED_BY' },
    { label: 'Related To', value: 'RELATED_TO' }
  ];

  const handleAddDependency = () => {
    onAddDependency({
      sourceProjectId: project.id,
      ...newDependency
    });
    setShowModal(false);
    setNewDependency({
      targetProjectId: '',
      type: 'BLOCKS',
      description: ''
    });
  };

  return (
    <Container
      header={
        <Header
          variant="h2"
          actions={
            <Button onClick={() => setShowModal(true)}>
              Add Dependency
            </Button>
          }
        >
          Project Dependencies
        </Header>
      }
    >
      <SpaceBetween size="m">
        <Alert type="info">
          Managing dependencies helps prevent conflicts and ensures proper project sequencing.
        </Alert>

        <Table
          columnDefinitions={[
            {
              id: 'project',
              header: 'Dependent Project',
              cell: item => 
                allProjects.find(p => p.id === item.targetProjectId)?.name || ''
            },
            {
              id: 'type',
              header: 'Dependency Type',
              cell: item => item.type
            },
            {
              id: 'description',
              header: 'Description',
              cell: item => item.description
            },
            {
              id: 'actions',
              header: 'Actions',
              cell: item => (
                <Button
                  variant="link"
                  onClick={() => onRemoveDependency(item.id)}
                >
                  Remove
                </Button>
              )
            }
          ]}
          items={[]} // Connect to your dependencies data
        />
      </SpaceBetween>

      <Modal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        header="Add Project Dependency"
      >
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleAddDependency}>Add</Button>
            </SpaceBetween>
          }
        >
          <FormField label="Dependent Project">
            <Select
              selectedOption={
                newDependency.targetProjectId
                  ? {
                      label: allProjects.find(p => p.id === newDependency.targetProjectId)?.name || '',
                      value: newDependency.targetProjectId
                    }
                  : null
              }
              onChange={({ detail }) =>
                setNewDependency(prev => ({
                  ...prev,
                  targetProjectId: detail.selectedOption.value as string
                }))
              }
              options={allProjects
                .filter(p => p.id !== project.id)
                .map(p => ({
                  label: p.name,
                  value: p.id
                }))}
            />
          </FormField>

          <FormField label="Dependency Type">
            <Select
              selectedOption={{
                label: dependencyTypes.find(t => t.value === newDependency.type)?.label || '',
                value: newDependency.type
              }}
              onChange={({ detail }) =>
                setNewDependency(prev => ({
                  ...prev,
                  type: detail.selectedOption.value as Dependency['type']
                }))
              }
              options={dependencyTypes}
            />
          </FormField>

          <FormField label="Description">
            <Input
              value={newDependency.description}
              onChange={({ detail }) =>
                setNewDependency(prev => ({
                  ...prev,
                  description: detail.value
                }))
              }
            />
          </FormField>
        </Form>
      </Modal>
    </Container>
  );
};

export default ProjectDependencies; 