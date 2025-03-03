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
} 