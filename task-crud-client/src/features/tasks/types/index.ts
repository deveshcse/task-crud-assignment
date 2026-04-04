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

/** Matches GET /tasks payload from the API (flat pagination fields). */
export interface TaskResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export { type TaskStatus, type CreateTaskInput, type UpdateTaskInput };
