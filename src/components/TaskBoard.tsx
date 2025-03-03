import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  Cards,
  SpaceBetween,
  Button,
  Modal,
  Form,
  FormField,
  Input,
  Select,
  Textarea,
  Grid
} from '@cloudscape-design/components';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  assignee: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string;
  projectId?: string;
}

interface TaskBoardProps {
  projectId?: string;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    status: 'TODO',
    priority: 'MEDIUM'
  });

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks${projectId ? `?projectId=${projectId}` : ''}`
      );
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleCreateTask = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...newTask, projectId })
      });
      const data = await response.json();
      setTasks(prev => [...prev, data]);
      setShowCreateModal(false);
      setNewTask({ status: 'TODO', priority: 'MEDIUM' });
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const statusColumns: Task['status'][] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

  return (
    <Container
      header={
        <Header
          variant="h2"
          actions={
            <Button onClick={() => setShowCreateModal(true)}>
              Create Task
            </Button>
          }
        >
          Task Board
        </Header>
      }
    >
      <Grid
        gridDefinition={statusColumns.map(() => ({ colspan: 3 }))}
      >
        {statusColumns.map(status => (
          <Container
            key={status}
            header={
              <Header variant="h3">{status}</Header>
            }
          >
            <Cards
              items={tasks.filter(task => task.status === status)}
              cardDefinition={{
                header: item => item.title,
                sections: [
                  {
                    id: "description",
                    content: item => item.description
                  },
                  {
                    id: "assignee",
                    header: "Assignee",
                    content: item => item.assignee
                  },
                  {
                    id: "priority",
                    header: "Priority",
                    content: item => (
                      <Box color={
                        item.priority === 'HIGH' ? 'red' :
                        item.priority === 'MEDIUM' ? 'orange' : 'green'
                      }>
                        {item.priority}
                      </Box>
                    )
                  },
                  {
                    id: "actions",
                    content: item => (
                      <SpaceBetween direction="horizontal" size="xs">
                        {status !== 'DONE' && (
                          <Button
                            onClick={() => handleStatusChange(
                              item.id,
                              statusColumns[statusColumns.indexOf(status) + 1]
                            )}
                          >
                            Move →
                          </Button>
                        )}
                      </SpaceBetween>
                    )
                  }
                ]
              }}
            />
          </Container>
        ))}
      </Grid>

      <Modal
        visible={showCreateModal}
        onDismiss={() => setShowCreateModal(false)}
        header="Create Task"
      >
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateTask}>Create</Button>
            </SpaceBetween>
          }
        >
          <FormField label="Title">
            <Input
              value={newTask.title || ''}
              onChange={({ detail }) =>
                setNewTask(prev => ({ ...prev, title: detail.value }))
              }
            />
          </FormField>
          <FormField label="Description">
            <Textarea
              value={newTask.description || ''}
              onChange={({ detail }) =>
                setNewTask(prev => ({ ...prev, description: detail.value }))
              }
            />
          </FormField>
          <FormField label="Assignee">
            <Input
              value={newTask.assignee || ''}
              onChange={({ detail }) =>
                setNewTask(prev => ({ ...prev, assignee: detail.value }))
              }
            />
          </FormField>
          <FormField label="Priority">
            <Select
              selectedOption={
                newTask.priority
                  ? { label: newTask.priority, value: newTask.priority }
                  : null
              }
              onChange={({ detail }) =>
                setNewTask(prev => ({
                  ...prev,
                  priority: detail.selectedOption.value as Task['priority']
                }))
              }
              options={[
                { label: 'Low', value: 'LOW' },
                { label: 'Medium', value: 'MEDIUM' },
                { label: 'High', value: 'HIGH' }
              ]}
            />
          </FormField>
          <FormField label="Due Date">
            <Input
              type="date"
              value={newTask.dueDate || ''}
              onChange={({ detail }) =>
                setNewTask(prev => ({ ...prev, dueDate: detail.value }))
              }
            />
          </FormField>
        </Form>
      </Modal>
    </Container>
  );
};

export default TaskBoard; 