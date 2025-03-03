export interface Project {
  id: string;
  name: string;
  phase: ProjectPhase;
  startDate: string;
  endDate: string;
  description?: string;
  resources: ResourceAllocation[];
  jiraId?: string;
  tpmId?: string;
}

export interface Resource {
  id: string;
  name: string;
  alias: string;
  role: string;
  team: string;
  availability: number;
  allocation: number;
  allocations?: Array<{ projectId: string; allocation: number }>;
  projectId: string;
}

export interface ResourceAllocation {
  id: string;
  resourceId: string;
  projectId: string;
  percentage: number;
  startDate: string;
  endDate: string;
  phase: ProjectPhase;
}

export enum ProjectPhase {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD',
  MAINTENANCE = 'MAINTENANCE',
  DEVELOPMENT = 'DEVELOPMENT'
}

export enum ResourceRole {
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  DEVELOPER = 'DEVELOPER',
  DESIGNER = 'DESIGNER',
  QA_ENGINEER = 'QA_ENGINEER',
  DEVOPS_ENGINEER = 'DEVOPS_ENGINEER',
  BUSINESS_ANALYST = 'BUSINESS_ANALYST'
} 

export interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  title?: string;
  assignee?: string;
  status?: string;
  dueDate?: string;
}

export type DependencyType = 'BLOCKS' | 'REQUIRED_BY' | 'RELATED_TO';

export interface Dependency {
  id: string;
  sourceProjectId: string;
  targetProjectId: string;
  type: DependencyType;
  description: string;
}

export interface ResourceAllocation {
  resourceId: string;
  projectId: string;
  percentage: number;
}

export interface Datum<T> {
  x: T;
  y: number;
  title?: string;
  value?: number;
  color?: string;
}

export type Color = 'blue' | 'grey' | 'red' | 'green' | 'yellow' | 'orange';

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface ProjectService {
  getProjects: () => Promise<Project[]>;
  createProject: (project: Omit<Project, 'id'>) => Promise<Project>;
  updateProject: (id: string, project: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}
