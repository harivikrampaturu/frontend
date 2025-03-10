import React, { useState } from 'react';
import {
  Container,
  Header,
  Table,
  Button,
  SpaceBetween,
  Pagination,
  Box,
} from '@cloudscape-design/components';
import { Resource } from '../types';
import { useResources } from '../hooks/useResources';
import { Link } from 'react-router-dom';


import { ResourceModal } from '../components/ResourceModal';

import TextFilter from "@cloudscape-design/components/text-filter";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";
import { TableProps } from "@cloudscape-design/components/table";

export const Resources: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const { resources, loading, createResource, updateResource, deleteResource } = useResources();


  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [selectedItems, setSelectedItems] = useState<Resource[]>([]);
  const [filteringText, setFilteringText] = useState("");
  const [sortingField, setSortingField] = useState<TableProps.SortingColumn<Resource> | undefined>({ sortingField: 'name' });
  const [sortingDescending, setSortingDescending] = useState(false);



  const handleEditClick = (resource: Resource) => {
    setSelectedResource(resource);
    setShowEditModal(true);
  };

  // Filter and sort resources
  const sortedAndFilteredItems = React.useMemo(() => {
    let items = [...resources];

    // Apply filtering
    if (filteringText) {
      items = items.filter(item => {
        const searchText = filteringText.toLowerCase();
        return (
          item.name.toLowerCase().includes(searchText) ||
          item.role.toLowerCase().includes(searchText) ||
          item.team.toLowerCase().includes(searchText) ||
          item.alias?.toLowerCase().includes(searchText)
        );
      });
    }

    // Apply sorting
    return items.sort((a, b) => {
      let aValue = sortingField ? a[sortingField.sortingField as keyof Resource] : '';
      let bValue = sortingField ? b[sortingField.sortingField as keyof Resource] : '';

      // Convert to strings for comparison
      aValue = aValue !== null && aValue !== undefined ? String(aValue) : '';
      bValue = bValue !== null && bValue !== undefined ? String(bValue) : '';

      // Handle numeric fields differently
      if (sortingField?.sortingField === 'availability') {
        return sortingDescending
          ? Number(bValue) - Number(aValue)
          : Number(aValue) - Number(bValue);
      }

      // String comparison for other fields
      return sortingDescending
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    });
  }, [resources, filteringText, sortingField, sortingDescending]);

  // Apply pagination
  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedAndFilteredItems.slice(startIndex, endIndex);
  }, [sortedAndFilteredItems, currentPage, pageSize]);

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

        <Table
          renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
            `Displaying resources ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
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
              header: 'Name',
              cell: item => <Link to={`/resources/${item.id}`}>{item.name}</Link>,
              sortingField: 'name'
            },
            {
              id: 'alias',
              header: 'Alias',
              cell: item => item.alias,
              sortingField: 'alias'
            },
            {
              id: 'role',
              header: 'Role',
              cell: item => item.role,
              sortingField: 'role'
            },
            {
              id: 'team',
              header: 'Team',
              cell: item => item.team,
              sortingField: 'team'
            },
            {
              id: 'availability',
              header: 'Availability',
              cell: item => `${item.availability}%`,
              sortingField: 'availability'
            },
            {
              id: 'actions',
              header: 'Actions',
              cell: item => (
                <SpaceBetween direction="horizontal" size="xs">
                  <Button onClick={() => handleEditClick(item)}>Edit</Button>
                  <Button
                    variant="normal"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this resource?')) {
                        try {
                          await deleteResource(item.id);
                          if (selectedResource?.id === item.id) {
                            setSelectedResource(null);
                          }
                        } catch (error) {
                          console.error('Failed to delete resource:', error);
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                </SpaceBetween>
              )
            }
          ]}
          items={paginatedItems}
          loading={loading}
          loadingText="Loading resources"
          filter={
            <TextFilter
              filteringPlaceholder="Find resources"
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
              pagesCount={Math.ceil(sortedAndFilteredItems.length / pageSize)}
              onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
            />
          }
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              preferences={{
                pageSize: pageSize,
                contentDisplay: [
                  { id: 'name', visible: true },
                  { id: 'alias', visible: true },
                  { id: 'role', visible: true },
                  { id: 'team', visible: true },
                  { id: 'availability', visible: true }
                ]
              }}
              pageSizePreference={{
                title: "Page size",
                options: [
                  { value: 10, label: "10 resources" },
                  { value: 20, label: "20 resources" },
                  { value: 50, label: "50 resources" }
                ]
              }}
              contentDisplayPreference={{
                options: [
                  { id: 'name', label: 'Name', alwaysVisible: true },
                  { id: 'alias', label: 'Alias' },
                  { id: 'role', label: 'Role' },
                  { id: 'team', label: 'Team' },
                  { id: 'availability', label: 'Availability' }
                ]
              }}
            />
          }
          empty={
            <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
              <SpaceBetween size="m">
                <b>No resources</b>
                <Button onClick={() => setShowCreateModal(true)}>Create resource</Button>
              </SpaceBetween>
            </Box>
          }
        />
      </SpaceBetween>

      <ResourceModal
        visible={showCreateModal}
        onDismiss={() => setShowCreateModal(false)}
        onSubmit={async (data) => {
          await createResource(data);
        }}
        mode="create"
      />

      <ResourceModal
        visible={showEditModal}
        onDismiss={() => setShowEditModal(false)}
        onSubmit={async (data) => {
          if (!selectedResource) return Promise.reject('No resource selected');
          await updateResource(selectedResource.id, data);
        }}
        initialData={selectedResource || undefined}
        mode="edit"
      />
    </Container>
  );
};

export default Resources; 