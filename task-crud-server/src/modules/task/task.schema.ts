import { z } from "zod";

// ── Task status enum (mirrors Prisma enum) ────────────────────────────────────

export const taskStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "DONE"]);

export type TaskStatus = z.infer<typeof taskStatusEnum>;

// ── Create task ───────────────────────────────────────────────────────────────

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z.string().max(2000, "Description is too long").optional(),
    status: taskStatusEnum.optional(),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>["body"];

// ── Update task ───────────────────────────────────────────────────────────────

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Task ID is required"),
  }),
  body: z
    .object({
      title: z.string().min(1, "Title cannot be empty").max(255).optional(),
      description: z.string().max(2000).nullable().optional(),
      status: taskStatusEnum.optional(),
    })
    .refine(
      (data) =>
        data.title !== undefined ||
        data.description !== undefined ||
        data.status !== undefined,
      { message: "At least one field must be provided" }
    ),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>["body"];

// ── Task ID param ─────────────────────────────────────────────────────────────

export const taskIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Task ID is required"),
  }),
});

export type TaskIdParam = z.infer<typeof taskIdParamSchema>["params"];

// ── List tasks query ──────────────────────────────────────────────────────────

export const listTasksQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    status: taskStatusEnum.optional(),
    search: z.string().optional(),
  }),
});

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>["query"];
