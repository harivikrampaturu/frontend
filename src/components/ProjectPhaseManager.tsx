import React, { useState } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Button,
  Modal,
  Form,
  FormField,
  DatePicker,
  Select,
  StatusIndicator,
  Box,
  StatusIndicatorProps
} from '@cloudscape-design/components';
import { Project, ProjectPhase } from '../types';

interface ProjectPhaseManagerProps {
  project: Project;
  onPhaseUpdate: (projectId: string, phase: ProjectPhase, startDate: string, endDate: string) => void;
}

const phaseDescriptions: Record<ProjectPhase, string> = {
  PLANNING: 'Initial project setup and resource planning',
  IN_PROGRESS: 'Active development and implementation',
  COMPLETED: 'Project successfully delivered',
  ON_HOLD: 'Project temporarily paused',
  MAINTENANCE: 'Ongoing maintenance and support',
  DEVELOPMENT: 'Core development phase'
};

export const ProjectPhaseManager: React.FC<ProjectPhaseManagerProps> = ({
  project,
  onPhaseUpdate
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<ProjectPhase>(project.phase);
  const [dates, setDates] = useState({
    startDate: project.startDate,
    endDate: project.endDate
  });

  const handlePhaseUpdate = () => {
    if (!dates.startDate || !dates.endDate) {
      return; // Add validation
    }

    onPhaseUpdate(project.id, selectedPhase, dates.startDate, dates.endDate);
    setShowModal(false);
  };

  const getPhaseStatus = (phase: ProjectPhase): StatusIndicatorProps.Type => {
    const phases = Object.values(ProjectPhase);
    const currentIndex = phases.indexOf(project.phase);
    const phaseIndex = phases.indexOf(phase);

    if (phaseIndex < currentIndex) return 'success';
    if (phaseIndex === currentIndex) return 'in-progress';
    return 'pending';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container
      header={
        <Header
          variant="h2"
          actions={
            <Button onClick={() => setShowModal(true)}>
              Update Phase
            </Button>
          }
        >
          Project Timeline & Phases
        </Header>
      }
    >
      <SpaceBetween direction="vertical" size="s">
        {/* Phase Timeline */}
        <Box padding="s">
          <SpaceBetween size="xs">
            <div><strong>Project Duration:</strong></div>
            <div>{formatDate(project.startDate)} - {formatDate(project.endDate)}</div>
          </SpaceBetween>
        </Box>

        {/* Phase Progress */}
        {Object.values(ProjectPhase).map(phase => (
          <Box key={phase} padding="xs">
            <SpaceBetween size="xs">
              <StatusIndicator type={getPhaseStatus(phase)}>
                {phase} {phase === project.phase && '(Current Phase)'}
              </StatusIndicator>
              <Box color="text-body-secondary" fontSize="body-s">
                {phaseDescriptions[phase]}
              </Box>
            </SpaceBetween>
          </Box>
        ))}
      </SpaceBetween>

      <Modal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        header="Update Project Phase"
      >
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handlePhaseUpdate}>Update</Button>
            </SpaceBetween>
          }
        >
          <FormField label="Phase">
            <Select
              selectedOption={{ label: selectedPhase, value: selectedPhase }}
              onChange={({ detail }) =>
                setSelectedPhase(detail.selectedOption.value as ProjectPhase)
              }
              options={Object.values(ProjectPhase).map(phase => ({
                label: phase,
                value: phase
              }))}
            />
          </FormField>

          <FormField label="Start Date">
            <DatePicker
              value={dates.startDate}
              onChange={({ detail }) =>
                setDates(prev => ({ ...prev, startDate: detail.value }))
              }
            />
          </FormField>

          <FormField label="End Date">
            <DatePicker
              value={dates.endDate}
              onChange={({ detail }) =>
                setDates(prev => ({ ...prev, endDate: detail.value }))
              }
            />
          </FormField>
        </Form>
      </Modal>
    </Container>
  );
};

export default ProjectPhaseManager; 