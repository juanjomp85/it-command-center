// packages/types/src/index.ts

// 1. Enums: Estados y Prioridades
export enum TaskStatus {
    BACKLOG = 'BACKLOG',
    PLANNED = 'PLANNED',
    IN_PROGRESS = 'IN_PROGRESS',
    IN_REVIEW = 'IN_REVIEW',
    COMPLETED = 'COMPLETED',
  }
  
  export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
  }
  
  // 2. Interfaces Core
  export interface IUser {
    id: string;
    email: string;
    name: string;
    // Omitimos roles aquí por ahora para mantenerlo simple en el Sprint 1
  }
  
  export interface ITask {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: Date;
    assigneeId?: string; // Solo guardamos la referencia (ID) para evitar anidación excesiva
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // 3. DTOs (Data Transfer Objects) - Lo que el Frontend enviará al Backend
  export interface CreateTaskDTO {
    title: string;
    description?: string;
    priority?: TaskPriority;
    dueDate?: Date;
    assigneeId?: string;
  }