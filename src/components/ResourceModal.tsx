import React from 'react';
import {
    Modal,
    Form,
    SpaceBetween,
    Button,
    FormField,
    Input,
    Select
} from '@cloudscape-design/components';
import { Resource, ResourceRole } from '../types';

interface ResourceModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSubmit: (data: Omit<Resource, 'id'>) => Promise<void>;
    initialData?: Partial<Resource>;
    mode: 'create' | 'edit';
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
    visible,
    onDismiss,
    onSubmit,
    initialData,
    mode
}) => {
    const [formData, setFormData] = React.useState({
        name: '',
        alias: '',
        role: ResourceRole.DEVELOPER,
        team: '',
        availability: 100
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                alias: initialData.alias || '',
                role: initialData.role as ResourceRole || ResourceRole.DEVELOPER,
                team: initialData.team || '',
                availability: initialData.availability || 100
            });
        }
    }, [initialData]);

    const resetForm = () => {
        setFormData({
            name: '',
            alias: '',
            role: ResourceRole.DEVELOPER,
            team: '',
            availability: 100
        });
    };

    const handleDismiss = () => {
        resetForm();
        onDismiss();
    };

    return (
        <Modal
            visible={visible}
            onDismiss={handleDismiss}
            header={mode === 'create' ? 'Add Resource' : 'Edit Resource'}
        >
            <Form
                actions={
                    <SpaceBetween direction="horizontal" size="s">
                        <Button onClick={handleDismiss}>Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={async () => {
                                try {
                                    await onSubmit(formData as Omit<Resource, 'id'>);
                                    handleDismiss();
                                } catch (error) {
                                    console.error(`Failed to ${mode} resource:`, error);
                                }
                            }}
                        >
                            {mode === 'create' ? 'Create' : 'Save'}
                        </Button>
                    </SpaceBetween>
                }
            >
                <SpaceBetween size="m">
                    <FormField label="Name">
                        <Input
                            value={formData.name}
                            onChange={({ detail }) =>
                                setFormData(prev => ({ ...prev, name: detail.value }))
                            }
                        />
                    </FormField>
                    <FormField label="Alias">
                        <Input
                            value={formData.alias}
                            onChange={({ detail }) =>
                                setFormData(prev => ({ ...prev, alias: detail.value }))
                            }
                        />
                    </FormField>
                    <FormField label="Role">
                        <Select
                            selectedOption={{ label: formData.role, value: formData.role }}
                            onChange={({ detail }) =>
                                setFormData(prev => ({
                                    ...prev,
                                    role: detail.selectedOption.value as ResourceRole
                                }))
                            }
                            options={Object.values(ResourceRole).map(role => ({
                                label: role,
                                value: role
                            }))}
                        />
                    </FormField>
                    <FormField label="Team">
                        <Input
                            value={formData.team}
                            onChange={({ detail }) =>
                                setFormData(prev => ({ ...prev, team: detail.value }))
                            }
                        />
                    </FormField>
                    <FormField label="Availability (%)">
                        <Input
                            type="number"
                            value={formData.availability.toString()}
                            onChange={({ detail }) =>
                                setFormData(prev => ({
                                    ...prev,
                                    availability: parseInt(detail.value) || 0
                                }))
                            }
                        />
                    </FormField>
                </SpaceBetween>
            </Form>
        </Modal>
    );
}; 