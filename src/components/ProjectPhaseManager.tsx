import React, { useState } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Timeline,
  Button,
  Modal,
  Form,
  FormField,
  DatePicker,
  Select
} from '@cloudscape-design/components';
import { Project, ProjectPhase } from '../types';

interface ProjectPhaseManagerProps {
  project: Project;
  onPhaseUpdate: (projectId: string, phase: ProjectPhase, startDate: string, endDate: string) => void;
}

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
    onPhaseUpdate(project.id, selectedPhase, dates.startDate, dates.endDate);
    setShowModal(false);
  };

  const getPhaseStatus = (phase: ProjectPhase) => {
    const phases = Object.values(ProjectPhase);
    const currentIndex = phases.indexOf(project.phase);
    const phaseIndex = phases.indexOf(phase);

    if (phaseIndex < currentIndex) return 'complete';
    if (phaseIndex === currentIndex) return 'in-progress';
    return 'upcoming';
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
          Project Timeline
        </Header>
      }
    >
      <Timeline
        items={Object.values(ProjectPhase).map(phase => ({
          id: phase,
          content: phase,
          status: getPhaseStatus(phase),
          time: phase === project.phase ? 'Current Phase' : ''
        }))}
      />

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