import axios from 'axios';
import { Project } from '../types';

export interface ProjectReport {
  projectId: string;
  metrics: {
    resourceUtilization: number;
    phaseProgress: number;
    timelineDeviation: number;
    resourceCount: number;
  };
  risks: string[];
  recommendations: string[];
}

export class ReportingService {
  private apiUrl = import.meta.env.VITE_API_URL;

  async generateProjectReport(projectId: string): Promise<ProjectReport> {
    const response = await axios.get(`${this.apiUrl}/reports/project/${projectId}`);
    return response.data;
  }

  async generateResourceReport(resourceId: string): Promise<any> {
    const response = await axios.get(`${this.apiUrl}/reports/resource/${resourceId}`);
    return response.data;
  }

  async exportToExcel(projects: Project[]): Promise<Blob> {
    const response = await axios.post(
      `${this.apiUrl}/reports/export`,
      { projects },
      { responseType: 'blob' }
    );
    return response.data;
  }

  async generateDashboardReport(): Promise<any> {
    const response = await axios.get(`${this.apiUrl}/reports/dashboard`);
    return response.data;
  }
} 