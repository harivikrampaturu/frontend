import React, { useState, useEffect } from 'react';
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
  Select,
  DatePicker,
  // Link,
} from '@cloudscape-design/components';
import { Project, ProjectPhase } from '../types';
import { useProjects } from '../hooks/useProjects';
import GanttChart from '../components/GanttChart';
// import { useNotifications } from '../contexts/NotificationContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ResourceManagement } from '../components/ResourceManagement';
import { Link } from 'react-router-dom';

export const Projects: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { projects, loading, setProjects } = useProjects();
  // const { addNotification } = useNotifications();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phase: ProjectPhase.PLANNING,
    startDate: '',
    endDate: '',
    description: ''
  });

  useEffect(() => {
    const projectId = searchParams.get('id');
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [searchParams, projects]);

  const handleCreateProject = async () => {
    if (!formData.name) return;

    const newProject = {
      ...formData,
      // Convert dates to ISO format before sending
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : '',
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : '',
      resources: [], // Initialize with empty resources array
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });

      if (!response.ok) throw new Error('Failed to create project');

      const data = await response.json();
      setProjects(prev => [...prev, data]);
      setShowCreateModal(false);
      setFormData({
        name: '',
        phase: ProjectPhase.PLANNING,
        startDate: '',
        endDate: '',
        description: ''
      });
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic
    }
  };

  // Helper function to format ISO date for display
  const formatDate = (isoDate: string) => {
    if (!isoDate) return isoDate || '';
    return new Date(isoDate).toLocaleDateString();
  };

  return (
    <Container
      header={
        <Header
          variant="h1"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setShowCreateModal(true)}>Create Project</Button>
              <Button>Import from TPM</Button>
              <Button>Export to JIRA</Button>
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <Button onClick={() => document.getElementById('file-upload')?.click()}>
                Upload Project File
              </Button>
            </SpaceBetween>
          }
        >
          Projects
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Table
          loading={loading}
          items={projects}
          selectedItems={selectedProject ? [selectedProject] : []}
          onSelectionChange={({ detail }) => {
            const selected = detail.selectedItems[0] as Project;
            if (selected) {
              navigate(`/projects/${selected.id}`);
            }
          }}
          columnDefinitions={[
            {
              id: 'name',
              header: 'Project Name',
              cell: item => <Link to={`/projects/${item.id}`}>{item.name}</Link>
            },
            {
              id: 'phase',
              header: 'Phase',
              cell: item => item.phase
            },
            {
              id: 'startDate',
              header: 'Start Date',
              cell: item => formatDate(item.startDate)
            },
            {
              id: 'endDate',
              header: 'End Date',
              cell: item => formatDate(item.endDate)
            }
          ]}
        />

        {selectedProject && (
          <SpaceBetween size="l">
            <GanttChart project={selectedProject} />
            <ResourceManagement />
          </SpaceBetween>
        )}
      </SpaceBetween>

      <Modal
        visible={showCreateModal}
        onDismiss={() => setShowCreateModal(false)}
        header="Create New Project"
        size="medium"
      >
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateProject}>Create</Button>
            </SpaceBetween>
          }
        >
          <SpaceBetween size="l">
            <FormField label="Project Name">
              <Input
                value={formData.name}
                onChange={({ detail }) =>
                  setFormData(prev => ({ ...prev, name: detail.value }))
                }
              />
            </FormField>
            <FormField label="Phase">
              <Select
                selectedOption={{ label: formData.phase, value: formData.phase }}
                onChange={({ detail }) =>
                  setFormData(prev => ({
                    ...prev,
                    phase: detail.selectedOption.value as ProjectPhase
                  }))
                }
                options={Object.values(ProjectPhase).map(phase => ({
                  label: phase,
                  value: phase
                }))}
              />
            </FormField>
            <FormField label="Start Date">
              <DatePicker
                value={formData.startDate}
                onChange={({ detail }) =>
                  setFormData(prev => ({ ...prev, startDate: detail.value }))
                }
                placeholder="YYYY/MM/DD"
                expandToViewport
                startOfWeek={1}
              />
            </FormField>
            <FormField label="End Date">
              <DatePicker
                value={formData.endDate}
                onChange={({ detail }) =>
                  setFormData(prev => ({ ...prev, endDate: detail.value }))
                }
                placeholder="YYYY/MM/DD"
                openCalendarAriaLabel={selectedDate =>
                  `Choose end date${selectedDate ? `, selected date is ${selectedDate}` : ''}`
                }
                {...(formData.startDate && { minDate: formData.startDate })}
                expandToViewport
              />
            </FormField>
            <FormField label="Description">
              <Input
                value={formData.description}
                onChange={({ detail }) =>
                  setFormData(prev => ({ ...prev, description: detail.value }))
                }
              />
            </FormField>
          </SpaceBetween>
        </Form>
      </Modal>
    </Container>
  );
};

export default Projects; 