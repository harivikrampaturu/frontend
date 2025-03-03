import { useState, useEffect } from 'react';
import { Resource } from '../types';
import { ResourceService } from '../services/ResourceService';

export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resourceService = new ResourceService();

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getResources();
      setResources(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const createResource = async (resourceData: Omit<Resource, 'id'>) => {
    try {
      const newResource = await resourceService.createResource(resourceData);
      setResources(prev => [...prev, newResource]);
      return newResource;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resource');
      throw err;
    }
  };

  const updateResource = async (resourceId: string, resourceData: Partial<Resource>) => {
    try {
      const updatedResource = await resourceService.updateResource(resourceId, resourceData);
      setResources(prev => prev.map(r => r.id === resourceId ? updatedResource : r));
      return updatedResource;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resource');
      throw err;
    }
  };

  const deleteResource = async (resourceId: string) => {
    try {
      await resourceService.deleteResource(resourceId);
      setResources(prev => prev.filter(r => r.id !== resourceId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resource');
      throw err;
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return {
    resources,
    loading,
    error,
    createResource,
    updateResource,
    deleteResource,
    refreshResources: fetchResources
  };
}; 