import axios from 'axios';
import { Project } from '../types';

export class ProjectService {
  private apiUrl = import.meta.env.VITE_API_URL;

  async getProjects(): Promise<Project[]> {
    const response = await axios.get(`${this.apiUrl}/projects`);
    return response.data;
  }

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const response = await axios.post(`${this.apiUrl}/projects`, project);
    return response.data;
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const response = await axios.put(`${this.apiUrl}/projects/${id}`, project);
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await axios.delete(`${this.apiUrl}/projects/${id}`);
  }

} 