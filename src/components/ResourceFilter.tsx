import React, { useState } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  FormField,
  Input,
  Select,
  Grid,
  Button
} from '@cloudscape-design/components';
import { ResourceRole } from '../types';

interface ResourceFilterProps {
  onFilterChange: (filters: ResourceFilterCriteria) => void;
}

export interface ResourceFilterCriteria {
  name?: string;
  role?: ResourceRole;
  team?: string;
}

export const ResourceFilter: React.FC<ResourceFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<ResourceFilterCriteria>({});

  const handleFilterChange = (key: keyof ResourceFilterCriteria, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  // Check if any filter has a value
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <Container
      header={
        <Header
          variant="h2"
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
              >
                Clear filters
              </Button>
            </SpaceBetween>
          }
        >
          Filter Resources
        </Header>
      }
    >
      <Grid
        gridDefinition={[
          { colspan: 4 },
          { colspan: 4 },
          { colspan: 4 }
        ]}
      >
        <FormField label="Name">
          <Input
            value={filters.name || ''}
            onChange={({ detail }) =>
              handleFilterChange('name', detail.value)
            }
          />
        </FormField>

        <FormField label="Role">
          <Select
            selectedOption={
              filters.role
                ? { label: filters.role, value: filters.role }
                : null
            }
            onChange={({ detail }) =>
              handleFilterChange('role', detail.selectedOption?.value || '')
            }
            options={Object.values(ResourceRole).map(role => ({
              label: role,
              value: role
            }))}
          />
        </FormField>

        <FormField label="Team">
          <Input
            value={filters.team || ''}
            onChange={({ detail }) =>
              handleFilterChange('team', detail.value)
            }
          />
        </FormField>
      </Grid>
    </Container>
  );
};

export default ResourceFilter; 