import React from 'react';
import { AppLayout, ContentLayout } from '@cloudscape-design/components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Resources from './pages/Resources';
// import Reports from './pages/Reports';
import ProjectDetails from './pages/ProjectDetails';
import ResourceDetails from './pages/ResourceDetails';
import { NotificationProvider } from './contexts/NotificationContext';

const App: React.FC = () => {
  // const { addNotification } = useNotifications();

  /* const { addNotification } = useNotifications();

  // Add a success notification
  addNotification({
    type: 'success',
    content: 'Project created successfully',
    dismissible: true
  });

  // Add an error notification
  addNotification({
    type: 'error',
    content: 'Failed to create project',
    dismissible: true
  }); */

  return (
    <NotificationProvider>
      <Router>
        <AppLayout
          navigation={<Navigation />}
          content={
            <ContentLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/resources/:id" element={<ResourceDetails />} />
                {/* <Route path="/reports" element={<Reports />} /> */}
              </Routes>
            </ContentLayout>
          }
        />
      </Router>
    </NotificationProvider>
  );
};

export default App;
