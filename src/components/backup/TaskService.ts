/* import axios from 'axios';

export class TaskService {
  private apiUrl = import.meta.env.VITE_API_URL;

  async getTasks(projectId?: string): Promise<Task[]> {
    const url = projectId ? `${this.apiUrl}/tasks?projectId=${projectId}` : `${this.apiUrl}/tasks`;
    const response = await axios.get(url);
    return response.data;
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const response = await axios.post(`${this.apiUrl}/tasks`, task);
    return response.data;
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    const response = await axios.patch(`${this.apiUrl}/tasks/${id}`, task);
    return response.data;
  }

  async deleteTask(id: string): Promise<Task> {
    const response = await axios.delete(`${this.apiUrl}/tasks/${id}`);
    return response.data;
  }

  async updateAssignee(id: string, assignee: string): Promise<Task> {
    return this.updateTask(id, { assignee });
  }
}  */