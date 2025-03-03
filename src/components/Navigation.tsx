import React from 'react';
import { SideNavigation, SideNavigationProps } from '@cloudscape-design/components';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items: SideNavigationProps.Item[] = [
    { type: 'link', text: 'Dashboard', href: '/' },
    { type: 'link', text: 'Projects', href: '/projects' },
    { type: 'link', text: 'Resources', href: '/resources' },
    // { type: 'link', text: 'Reports', href: '/reports' }
  ];

  return (
    <SideNavigation
      activeHref={location.pathname}
      items={items}
      onFollow={e => {
        e.preventDefault();
        navigate(e.detail.href);
      }}
      header={{ text: 'PMS', href: '/' }}
    />
  );
};

export default Navigation; 