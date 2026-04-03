import { 
  TaskStatus, 
  CreateTaskInput, 
  UpdateTaskInput 
} from "@/shared/schemas/task-schema";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskResponse {
  tasks: Task[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export { type TaskStatus, type CreateTaskInput, type UpdateTaskInput };
