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
  alias?: string;
  role: ResourceRole;
  team: string;
  skills?: string[];
  availability?: number;
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
  DESIGN = 'DESIGN',
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  DEPLOYMENT = 'DEPLOYMENT',
  MAINTENANCE = 'MAINTENANCE'
}

export enum ResourceRole {
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  DEVELOPER = 'DEVELOPER',
  DESIGNER = 'DESIGNER',
  QA_ENGINEER = 'QA_ENGINEER',
  DEVOPS_ENGINEER = 'DEVOPS_ENGINEER',
  BUSINESS_ANALYST = 'BUSINESS_ANALYST'
} 