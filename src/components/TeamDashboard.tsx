import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  Grid,
  Cards,
  SpaceBetween,
  Link,
  Box
} from '@cloudscape-design/components';
import TeamChat from './TeamChat';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy';
  lastActive: string;
}

export const TeamDashboard: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    // Fetch team members
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/team/members`);
        const data = await response.json();
        setTeamMembers(data);
      } catch (error) {
        console.error('Failed to fetch team members:', error);
      }
    };

    fetchTeamMembers();
  }, []);

  return (
    <Container
      header={
        <Header variant="h2">Team Dashboard</Header>
      }
    >
      <SpaceBetween size="l">
        <Grid
          gridDefinition={[
            { colspan: 8 },
            { colspan: 4 }
          ]}
        >
          <TeamChat />
          
          <Container
            header={
              <Header variant="h3">Team Members</Header>
            }
          >
            <Cards
              items={teamMembers}
              cardDefinition={{
                header: item => (
                  <Link href={`/team/members/${item.id}`}>{item.name}</Link>
                ),
                sections: [
                  {
                    id: "role",
                    header: "Role",
                    content: item => item.role
                  },
                  {
                    id: "status",
                    header: "Status",
                    content: item => (
                      <Box color={
                        item.status === 'online' ? 'green' :
                        item.status === 'busy' ? 'red' : 'grey'
                      }>
                        {item.status}
                      </Box>
                    )
                  },
                  {
                    id: "lastActive",
                    header: "Last Active",
                    content: item => new Date(item.lastActive).toLocaleString()
                  }
                ]
              }}
            />
          </Container>
        </Grid>
      </SpaceBetween>
    </Container>
  );
};

export default TeamDashboard; 