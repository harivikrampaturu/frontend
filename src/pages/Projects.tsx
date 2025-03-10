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
  Select,
  DatePicker,
  Pagination,
  Box,
} from '@cloudscape-design/components';
import { Project, ProjectPhase } from '../types';
import { useProjects } from '../hooks/useProjects';
import GanttChart from '../components/GanttChart';

import { ResourceManagement } from '../components/ResourceManagement';
import { Link } from 'react-router-dom';
import TextFilter from "@cloudscape-design/components/text-filter";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import { TableProps } from "@cloudscape-design/components/table";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

export const Projects: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject] = useState<Project | null>(null);
  const { projects, loading } = useProjects();

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Project[]>([]);
  const [filteringText, setFilteringText] = useState("");
  const [sortingField, setSortingField] = useState<TableProps.SortingColumn<Project> | undefined>({ sortingField: 'name' });
  const [sortingDescending, setSortingDescending] = useState(false);
  const [preferences, setPreferences] = useState({
    pageSize: 10,
    contentDisplay: [
      { id: 'name', visible: true },
      { id: 'phase', visible: true },
      { id: 'startDate', visible: true },
      { id: 'endDate', visible: true }
    ]
  });

  // Filter and sort projects
  const sortedAndFilteredItems = React.useMemo(() => {
    let items = [...projects];

    // Apply filtering
    if (filteringText) {
      items = items.filter(item => {
        const searchText = filteringText.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchText) ||
          item.phase.toLowerCase().includes(searchText) ||
          (item.description?.toLowerCase().includes(searchText))
        );
      });
    }

    // Apply sorting
    return items.sort((a, b) => {
      let aValue = sortingField ? a[sortingField.sortingField as keyof Project] : '';
      let bValue = sortingField ? b[sortingField.sortingField as keyof Project] : '';

      // Handle dates
      if (sortingField?.sortingField === 'startDate' || sortingField?.sortingField === 'endDate') {
        const aDate = aValue ? new Date(aValue as string).getTime() : 0;
        const bDate = bValue ? new Date(bValue as string).getTime() : 0;
        return sortingDescending ? bDate - aDate : aDate - bDate;
      }

      // Convert to strings for comparison
      aValue = aValue !== null && aValue !== undefined ? String(aValue) : '';
      bValue = bValue !== null && bValue !== undefined ? String(bValue) : '';

      return sortingDescending
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    });
  }, [projects, filteringText, sortingField, sortingDescending]);

  // Apply pagination
  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * preferences.pageSize;
    const endIndex = startIndex + preferences.pageSize;
    return sortedAndFilteredItems.slice(startIndex, endIndex);
  }, [sortedAndFilteredItems, currentPage, preferences.pageSize]);

  const [formData, setFormData] = useState({
    name: '',
    phase: ProjectPhase.PLANNING,
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const projectData = JSON.parse(content);
            // TODO: Add validation and processing of project data
            console.log('Uploaded project data:', projectData);
            // TODO: Add API call to process the uploaded file
          }
        } catch (error) {
          console.error('Error parsing file:', error);
          // TODO: Add proper error handling
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error reading file:', error);
      // TODO: Add proper error handling
    }
  };

  const handleCreateProject = async () => {
    try {
      // TODO: Add API call to create project
      console.log('Creating project:', formData);
      setShowCreateModal(false);
      setFormData({
        name: '',
        phase: ProjectPhase.PLANNING,
        startDate: '',
        endDate: '',
        description: ''
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleTpmImport = async () => {
    try {
      const response = await fetch('/api/projects/import-tpm');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to import TPM data');
      }
      // Refresh projects list after import
      // This assumes your useProjects hook has a refetch method
      // projects.refetch();
    } catch (error) {
      console.error('Error importing TPM data:', error);
      // Add error handling (e.g., show error notification)
    }
  };

  return (
    <Container
      header={
        <Header
          variant="h1"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setShowCreateModal(true)}>Create Project</Button>
              <Button onClick={handleTpmImport}>Import from TPM</Button>
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
          renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
            `Displaying projects ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
          }
          selectedItems={selectedItems}
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
          trackBy="id"
          sortingColumn={sortingField}
          sortingDescending={sortingDescending}
          onSortingChange={({ detail }) => {
            if (detail.sortingColumn.sortingField === sortingField?.sortingField) {
              setSortingDescending(!sortingDescending);
            } else {
              setSortingField(detail.sortingColumn);
              setSortingDescending(false);
            }
          }}
          columnDefinitions={[
            {
              id: 'name',
              header: 'Project Name',
              cell: item => <Link to={`/projects/${item.id}`}>{item.name}</Link>,
              sortingField: 'name'
            },
            {
              id: 'phase',
              header: 'Phase',
              cell: item => item.phase,
              sortingField: 'phase'
            },
            {
              id: 'startDate',
              header: 'Start Date',
              cell: item => formatDate(item.startDate),
              sortingField: 'startDate'
            },
            {
              id: 'endDate',
              header: 'End Date',
              cell: item => formatDate(item.endDate),
              sortingField: 'endDate'
            }
          ]}
          items={paginatedItems}
          loading={loading}
          loadingText="Loading projects"
          filter={
            <TextFilter
              filteringPlaceholder="Find projects"
              filteringText={filteringText}
              onChange={({ detail }) => {
                setFilteringText(detail.filteringText);
                setCurrentPage(1); // Reset to first page on filter
              }}
              countText={`${sortedAndFilteredItems.length} matches`}
            />
          }
          pagination={
            <Pagination
              currentPageIndex={currentPage}
              pagesCount={Math.ceil(sortedAndFilteredItems.length / preferences.pageSize)}
              onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
            />
          }
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              preferences={preferences}
              onConfirm={({ detail }) => setPreferences({
                ...detail,
                pageSize: detail.pageSize || 10,
                contentDisplay: detail.contentDisplay?.map(item => ({
                  id: item.id,
                  visible: item.visible
                })) || [
                    { id: 'name', visible: true },
                    { id: 'phase', visible: true },
                    { id: 'startDate', visible: true },
                    { id: 'endDate', visible: true }
                  ]
              })}
              pageSizePreference={{
                title: "Page size",
                options: [
                  { value: 10, label: "10 projects" },
                  { value: 20, label: "20 projects" },
                  { value: 50, label: "50 projects" }
                ]
              }}
              contentDisplayPreference={{
                options: [
                  { id: "name", label: "Project Name", alwaysVisible: true },
                  { id: "phase", label: "Phase" },
                  { id: "startDate", label: "Start Date" },
                  { id: "endDate", label: "End Date" }
                ]
              }}
            />
          }
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No projects</b>
                <Button onClick={() => setShowCreateModal(true)}>Create project</Button>
              </SpaceBetween>
            </Box>
          }
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