import React from 'react';
import {
  PieChart,
} from '@cloudscape-design/components';
import { Resource } from '../types';

interface ResourceAllocationChartProps {
  resource: Resource;
}

export const ResourceAllocationChart: React.FC<ResourceAllocationChartProps> = ({ resource }) => {
  // Calculate total allocation from all active project allocations
  const totalAllocation = resource.allocations?.reduce((sum, allocation) => {
    return sum + (allocation.allocation || 0);
  }, 0) ?? 0;

  const data = [
    {
      x: 'Allocated',
      y: totalAllocation,
      title: 'Allocated',
      value: totalAllocation,
      color: '#16db93'
    },
    {
      x: 'Available',
      y: Math.max(0, 100 - totalAllocation),
      title: 'Available',
      value: Math.max(0, 100 - totalAllocation),
      color: '#e5e5e5'
    }
  ] as const;

  return (
    <PieChart
      data={data}
      detailPopoverContent={(datum) => [
        { key: 'Resource', value: resource.name },
        { key: datum.title || '', value: `${datum.value.toFixed(1)}%` }
      ]}
      i18nStrings={{
        detailsValue: "Value",
        detailsPercentage: "Percentage",
        filterLabel: "Filter",
        filterPlaceholder: "Filter data",
        filterSelectedAriaLabel: "selected",
        legendAriaLabel: "Legend",
        chartAriaRoleDescription: "pie chart"
      }}
      ariaDescription={`Resource allocation chart for ${resource.name}`}
      hideFilter={true}
      size="medium"
      variant="donut"
    />
  );
};

export default ResourceAllocationChart;