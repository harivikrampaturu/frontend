import axios from 'axios';
import { Project } from '../types';

export class FileService {
  private apiUrl = import.meta.env.VITE_API_URL;

  async uploadProjectFile(file: File): Promise<Project> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${this.apiUrl}/projects/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async downloadProjectFile(projectId: string): Promise<Blob> {
    const response = await axios.get(
      `${this.apiUrl}/projects/${projectId}/download`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }
} 