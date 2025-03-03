import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Header,
  SpaceBetween,
  Input,
  Button,
  Box,
  ScrollableContainer
} from '@cloudscape-design/components';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  projectId?: string;
}

interface TeamChatProps {
  projectId?: string;
}

export const TeamChat: React.FC<TeamChatProps> = ({ projectId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new WebSocket(import.meta.env.VITE_WS_URL);

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (!projectId || message.projectId === projectId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    };

    // Load previous messages
    fetchMessages();

    return () => {
      ws.current?.disconnect();
    };
  }, [projectId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat${projectId ? `?projectId=${projectId}` : ''}`
      );
      const data = await response.json();
      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      content: newMessage,
      projectId,
      timestamp: new Date().toISOString()
    };

    ws.current?.send(JSON.stringify(message));
    setNewMessage('');
  };

  return (
    <Container
      header={
        <Header variant="h2">Team Chat</Header>
      }
    >
      <SpaceBetween size="m">
        <ScrollableContainer
          height={400}
          ref={scrollRef}
        >
          {messages.map(message => (
            <Box
              key={message.id}
              padding="s"
              margin="s"
              backgroundColor={message.userId === 'currentUser' ? 'blue-100' : 'grey-100'}
              borderRadius="s"
            >
              <SpaceBetween size="xs">
                <Box color="text-body-secondary">
                  {message.userName}
                </Box>
                <Box>{message.content}</Box>
                <Box color="text-body-secondary" textAlign="right" fontSize="body-s">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Box>
              </SpaceBetween>
            </Box>
          ))}
        </ScrollableContainer>

        <SpaceBetween direction="horizontal" size="xs">
          <Input
            value={newMessage}
            onChange={({ detail }) => setNewMessage(detail.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </SpaceBetween>
      </SpaceBetween>
    </Container>
  );
};

export default TeamChat; 