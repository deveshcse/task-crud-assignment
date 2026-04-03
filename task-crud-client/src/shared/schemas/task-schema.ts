import { z } from "zod";

export const taskStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "DONE"]);

export type TaskStatus = z.infer<typeof taskStatusEnum>;

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().max(2000).nullable().optional(),
  status: taskStatusEnum.default("PENDING"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
