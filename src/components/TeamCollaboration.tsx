import React, { useState } from 'react';
import {
  Container,
  Header,
  Tabs,
  SpaceBetween,
  Table,
  Button,
  Modal,
  Form,
  FormField,
  Input,
  Textarea
} from '@cloudscape-design/components';

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  projectId: string;
}

interface Task {
  id: string;
  title: string;
  assignee: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  dueDate: string;
  projectId: string;
}

export const TeamCollaboration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('comments');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    assignee: '',
    dueDate: ''
  });

  return (
    <Container
      header={
        <Header variant="h2">Team Collaboration</Header>
      }
    >
      <Tabs
        activeTabId={activeTab}
        onChange={({ detail }) => setActiveTab(detail.activeTabId)}
        tabs={[
          {
            id: 'comments',
            label: 'Comments',
            content: (
              <SpaceBetween size="m">
                <Button onClick={() => setShowCommentModal(true)}>
                  Add Comment
                </Button>
                <Table
                  columnDefinitions={[
                    { id: 'user', header: 'User', cell: item => item.userId },
                    { id: 'comment', header: 'Comment', cell: item => item.content },
                    { id: 'time', header: 'Time', cell: item => item.timestamp }
                  ]}
                  items={[]} // Connect to your comments data
                />
              </SpaceBetween>
            )
          },
          {
            id: 'tasks',
            label: 'Tasks',
            content: (
              <SpaceBetween size="m">
                <Button onClick={() => setShowTaskModal(true)}>
                  Create Task
                </Button>
                <Table
                  columnDefinitions={[
                    { id: 'title', header: 'Title', cell: item => item.title },
                    { id: 'assignee', header: 'Assignee', cell: item => item.assignee },
                    { id: 'status', header: 'Status', cell: item => item.status },
                    { id: 'dueDate', header: 'Due Date', cell: item => item.dueDate }
                  ]}
                  items={[]} // Connect to your tasks data
                />
              </SpaceBetween>
            )
          }
        ]}
      />

      {/* Comment Modal */}
      <Modal
        visible={showCommentModal}
        onDismiss={() => setShowCommentModal(false)}
        header="Add Comment"
      >
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setShowCommentModal(false)}>Cancel</Button>
              <Button variant="primary">Submit</Button>
            </SpaceBetween>
          }
        >
          <FormField label="Comment">
            <Textarea
              value={newComment}
              onChange={({ detail }) => setNewComment(detail.value)}
            />
          </FormField>
        </Form>
      </Modal>

      {/* Task Modal */}
      <Modal
        visible={showTaskModal}
        onDismiss={() => setShowTaskModal(false)}
        header="Create Task"
      >
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setShowTaskModal(false)}>Cancel</Button>
              <Button variant="primary">Create</Button>
            </SpaceBetween>
          }
        >
          <FormField label="Title">
            <Input
              value={newTask.title}
              onChange={({ detail }) => 
                setNewTask(prev => ({ ...prev, title: detail.value }))
              }
            />
          </FormField>
          <FormField label="Assignee">
            <Input
              value={newTask.assignee}
              onChange={({ detail }) => 
                setNewTask(prev => ({ ...prev, assignee: detail.value }))
              }
            />
          </FormField>
          <FormField label="Due Date">
            <Input
              type="date"
              value={newTask.dueDate}
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

export default TeamCollaboration; 