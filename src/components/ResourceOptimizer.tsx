import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  Table,
  SpaceBetween,
  Button,
  Alert,
  ProgressBar
} from '@cloudscape-design/components';
import { Resource, Project, ResourceAllocation } from '../types';

interface ResourceOptimizerProps {
  resources: Resource[];
  projects: Project[];
  onOptimize: (allocations: ResourceAllocation[]) => void;
}

interface ResourceUtilization {
  resourceId: string;
  resourceName: string;
  currentLoad: number;
  recommendations: string[];
}

export const ResourceOptimizer: React.FC<ResourceOptimizerProps> = ({
  resources,
  projects,
  onOptimize
}) => {
  const [utilization, setUtilization] = useState<ResourceUtilization[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    calculateUtilization();
  }, [resources, projects]);

  const calculateUtilization = () => {
    const utilData = resources.map(resource => {
      const allocations = projects.flatMap(p => 
        p.resources.filter(a => a.resourceId === resource.id)
      );
      
      const currentLoad = allocations.reduce((sum, a) => sum + a.percentage, 0);
      const recommendations = getRecommendations(currentLoad, allocations);

      return {
        resourceId: resource.id,
        resourceName: resource.name,
        currentLoad,
        recommendations
      };
    });

    setUtilization(utilData);
  };

  const getRecommendations = (load: number, allocations: ResourceAllocation[]) => {
    const recommendations: string[] = [];

    if (load > 100) {
      recommendations.push('Overallocated: Consider reducing workload');
    } else if (load < 50) {
      recommendations.push('Underutilized: Available for more projects');
    }

    if (allocations.length > 3) {
      recommendations.push('Working on too many projects: Consider consolidation');
    }

    return recommendations;
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      // Implement optimization logic here
      const optimizedAllocations = utilization
        .filter(u => u.currentLoad > 100)
        .flatMap(u => {
          const resourceAllocations = projects.flatMap(p =>
            p.resources.filter(a => a.resourceId === u.resourceId)
          );
          
          // Simple optimization: Scale down allocations proportionally
          const scale = 100 / u.currentLoad;
          return resourceAllocations.map(a => ({
            ...a,
            percentage: Math.round(a.percentage * scale)
          }));
        });

      onOptimize(optimizedAllocations);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Container
      header={
        <Header
          variant="h2"
          actions={
            <Button
              loading={isOptimizing}
              onClick={handleOptimize}
            >
              Optimize Allocations
            </Button>
          }
        >
          Resource Optimization
        </Header>
      }
    >
      <SpaceBetween size="l">
        {utilization.some(u => u.currentLoad > 100) && (
          <Alert type="warning">
            Some resources are overallocated. Consider optimizing the workload.
          </Alert>
        )}

        <Table
          items={utilization}
          columnDefinitions={[
            {
              id: 'resourceName',
              header: 'Resource',
              cell: item => item.resourceName
            },
            {
              id: 'utilization',
              header: 'Current Utilization',
              cell: item => (
                <ProgressBar
                  value={item.currentLoad}
                  label={`${item.currentLoad}%`}
                  statusType={
                    item.currentLoad > 100 
                      ? 'error' 
                      : item.currentLoad > 80 
                        ? 'warning' 
                        : 'success'
                  }
                />
              )
            },
            {
              id: 'recommendations',
              header: 'Recommendations',
              cell: item => item.recommendations.join('; ')
            }
          ]}
        />
      </SpaceBetween>
    </Container>
  );
};

export default ResourceOptimizer; 