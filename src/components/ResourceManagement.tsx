import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    FormField,
    Input,
    SpaceBetween,
    Container,
    Header,
    Select
} from '@cloudscape-design/components';
import { useNotifications } from '../contexts/NotificationContext';

interface Resource {
    id: string;
    name: string;
    role: string;
    team: string;
    availability: number;
    alias?: string;
    allocations?: ProjectAllocation[];
}

interface ProjectAllocation {
    projectId: string;
    allocation: number;
}

interface Props {
    projectId?: string; // Optional: if provided, shows resources for specific project
    onResourceAssigned?: (resourceId: string, allocation: number) => void;
}

export const ResourceManagement: React.FC<Props> = ({ projectId, onResourceAssigned }) => {
    const { addNotification } = useNotifications();
    const [resources, setResources] = useState<Resource[]>([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedResource, setSelectedResource] = useState<string>('');
    const [allocation, setAllocation] = useState(100);
    const [availableResources, setAvailableResources] = useState<Resource[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);
    const [editingResource, setEditingResource] = useState<Resource | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editAllocation, setEditAllocation] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    const fetchResources = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/resources`);
            const data = await response.json();
            setResources(data);

            // Calculate available resources based on current allocations
            const available = data.filter((resource: Resource) => {
                const totalAllocation = resource.allocations?.reduce(
                    (sum: number, alloc: ProjectAllocation) => sum + alloc.allocation,
                    0
                ) || 0;
                return resource.availability - totalAllocation >= 0;
            });
            setAvailableResources(available);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleAssignResource = async () => {
        if (!selectedResource || !projectId) return;
        setIsAssigning(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/resources`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resourceId: selectedResource,
                    allocation: allocation
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to assign resource');
            }

            await response.json();
            onResourceAssigned?.(selectedResource, allocation);
            await fetchResources();
            setShowAssignModal(false);
            setSelectedResource('');
            setAllocation(100);
        } catch (error) {
            // Add error notification
            addNotification({
                type: 'error',
                content: `Failed to assign resource: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        } finally {
            setIsAssigning(false);
        }
    };

    const getResourceAvailability = (resource: Resource) => {
        const totalAllocation = resource.allocations?.reduce(
            (sum, alloc) => sum + alloc.allocation,
            0
        ) || 0;
        return resource.availability - totalAllocation;
    };

    const validateAllocation = (value: number, resourceId: string) => {
        const resource = resources.find(r => r.id === resourceId);
        if (!resource) return false;

        const available = getResourceAvailability(resource);
        return value > 0 && value <= available;
    };

    const handleUpdateAllocation = async () => {
        if (!editingResource || !projectId) return;
        setIsEditing(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/projects/${projectId}/resources/${editingResource.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ allocation: editAllocation })
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update resource allocation');
            }

            await response.json();
            await fetchResources();
            setShowEditModal(false);
            setEditingResource(null);
            setEditAllocation(0);
            addNotification({
                type: 'success',
                content: 'Resource allocation updated successfully'
            });
        } catch (error) {
            addNotification({
                type: 'error',
                content: `Failed to update resource allocation: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        } finally {
            setIsEditing(false);
        }
    };

    const handleDeleteAllocation = async (resourceId: string) => {
        if (!projectId) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/projects/${projectId}/resources/${resourceId}`,
                { method: 'DELETE' }
            );

            if (!response.ok) {
                throw new Error('Failed to remove resource allocation');
            }

            await response.json();
            await fetchResources();
            addNotification({
                type: 'success',
                content: 'Resource allocation removed successfully'
            });
        } catch (error) {
            addNotification({
                type: 'error',
                content: `Failed to remove resource allocation: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        }
    };

    const columnDefinitions = [
        { id: 'name', header: 'Name', cell: (item: Resource) => item.name },
        { id: 'role', header: 'Role', cell: (item: Resource) => item.role },
        { id: 'team', header: 'Team', cell: (item: Resource) => item.team },
        {
            id: 'allocation',
            header: 'Allocation',
            cell: (item: Resource) => projectId
                ? `${item.allocations?.find(a => a.projectId === projectId)?.allocation || 0}%`
                : `${item.availability}%`
        },
        {
            id: 'available',
            header: 'Available',
            cell: (item: Resource) => `${getResourceAvailability(item)}%`
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: (item: Resource) => (
                <SpaceBetween direction="horizontal" size="xs">
                    <Button
                        onClick={() => {
                            setEditingResource(item);
                            setEditAllocation(
                                item.allocations?.find(a => a.projectId === projectId)?.allocation || 0
                            );
                            setShowEditModal(true);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDeleteAllocation(item.id)}
                    >
                        Remove
                    </Button>
                </SpaceBetween>
            )
        }
    ];

    return (
        <Container
            header={
                <Header
                    variant="h2"
                    actions={
                        projectId && (
                            <Button onClick={() => setShowAssignModal(true)}>
                                Assign Resource
                            </Button>
                        )
                    }
                >
                    {projectId ? 'Project Resources' : 'All Resources'}
                </Header>
            }
        >
            <Table
                items={projectId
                    ? resources.filter(r => r.allocations?.some(a => a.projectId === projectId))
                    : resources
                }
                columnDefinitions={columnDefinitions}
            />

            {projectId && (
                <Modal
                    visible={showAssignModal}
                    onDismiss={() => setShowAssignModal(false)}
                    header="Assign Resource"
                >
                    <Form
                        actions={
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button onClick={() => setShowAssignModal(false)}>Cancel</Button>
                                <Button
                                    variant="primary"
                                    onClick={handleAssignResource}
                                    loading={isAssigning}
                                    disabled={isAssigning}
                                >
                                    Assign
                                </Button>
                            </SpaceBetween>
                        }
                    >
                        <SpaceBetween direction="vertical" size="m">
                            <FormField label="Resource">
                                <Select
                                    selectedOption={
                                        selectedResource
                                            ? {
                                                label: resources.find(r => r.id === selectedResource)?.name || '',
                                                value: selectedResource
                                            }
                                            : null
                                    }
                                    onChange={({ detail }) => {
                                        setSelectedResource(detail.selectedOption.value || '');
                                    }}
                                    options={availableResources.map(resource => ({
                                        label: `${resource.name} (${getResourceAvailability(resource)}% available)`,
                                        value: resource.id
                                    }))}
                                />
                            </FormField>
                            <FormField label="Allocation (%)">
                                <Input
                                    type="number"
                                    value={allocation.toString()}
                                    onChange={({ detail }) => {
                                        const value = Number(detail.value);
                                        if (selectedResource && validateAllocation(value, selectedResource)) {
                                            setAllocation(value);
                                        }
                                    }}
                                    invalid={!validateAllocation(allocation, selectedResource)}
                                />
                            </FormField>
                        </SpaceBetween>
                    </Form>
                </Modal>
            )}

            {projectId && (
                <Modal
                    visible={showEditModal}
                    onDismiss={() => setShowEditModal(false)}
                    header="Edit Resource Allocation"
                >
                    <Form
                        actions={
                            <SpaceBetween direction="horizontal" size="xs">
                                <Button onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleUpdateAllocation}
                                    loading={isEditing}
                                    disabled={isEditing}
                                >
                                    Update
                                </Button>
                            </SpaceBetween>
                        }
                    >
                        <FormField label="Resource">
                            <Input
                                value={editingResource?.name || ''}
                                disabled
                            />
                        </FormField>
                        <FormField label="Allocation (%)">
                            <Input
                                type="number"
                                value={editAllocation.toString()}
                                onChange={({ detail }) => {
                                    const value = Number(detail.value);
                                    if (editingResource && validateAllocation(value, editingResource.id)) {
                                        setEditAllocation(value);
                                    }
                                }}
                                invalid={!validateAllocation(editAllocation, editingResource?.id || '')}
                            />
                        </FormField>
                    </Form>
                </Modal>
            )}
        </Container>
    );
}; 