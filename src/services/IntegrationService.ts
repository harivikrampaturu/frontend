import axios from 'axios';
import { Project } from '../types';

export class IntegrationService {
  private apiUrl = import.meta.env.VITE_API_URL;

  async importFromTpm(tpmProjectId: string): Promise<Project> {
    const response = await axios.post(`${this.apiUrl}/projects/import/tpm`, {
      tpmProjectId
    });
    return response.data;
  }

  async exportToJira(project: Project): Promise<string> {
    const response = await axios.post(`${this.apiUrl}/projects/export/jira`, {
      projectId: project.id
    });
    return response.data.jiraId;
  }
} 