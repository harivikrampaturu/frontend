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
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
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
  allocation: number;
  resourceDetails?: Resource;
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

export type Color = 'blue' | 'grey' | 'red' | 'green' | 'yellow' | 'orange';

export interface Datum<T> {
  x: T;
  y: number;
  title?: string;
  value?: number;
  color?: string;
}

export interface GanttData {
  data: GanttTask[];
  links: GanttLink[];
}

export interface GanttTask {
  id: string;
  text: string;
  start_date: string;
  end_date: string;
  progress: number;
  parent?: string;
  open?: boolean;
  assignee?: string;
  priority?: string;
}

export interface GanttLink {
  id: string;
  source: string;
  target: string;
  type: string;
}
