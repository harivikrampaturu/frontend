import axios from 'axios';
import { Resource } from '../types';

export class ResourceService {
  private apiUrl = import.meta.env.VITE_API_URL;

  async getResources(): Promise<Resource[]> {
    const response = await axios.get(`${this.apiUrl}/resources`);
    return response.data;
  }

  async createResource(resource: Omit<Resource, 'id'>): Promise<Resource> {
    const response = await axios.post(`${this.apiUrl}/resources`, resource);
    return response.data;
  }

  async updateResource(id: string, resource: Partial<Resource>): Promise<Resource> {
    const response = await axios.put(`${this.apiUrl}/resources/${id}`, resource);
    return response.data;
  }

  async deleteResource(id: string): Promise<void> {
    await axios.delete(`${this.apiUrl}/resources/${id}`);
  }
} 