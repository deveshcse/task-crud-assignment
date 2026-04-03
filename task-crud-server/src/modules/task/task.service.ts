import { prisma } from "../../config/db.config.js";
import { BadRequestError, NotFoundError } from "../../utils/api-error.js";
import {
  isValidTransition,
  getNextToggleStatus,
} from "../../utils/task-state-machine.js";
import {
  type CreateTaskInput,
  type UpdateTaskInput,
  type ListTasksQuery,
  type TaskStatus,
} from "./task.schema.js";

// ── Get all tasks (paginated, filtered, searchable) ───────────────────────────

export async function getTasks(userId: string, query: ListTasksQuery) {
  const { status, search } = query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build where clause dynamically
  const where = {
    userId,
    ...(status ? { status } : {}),
    ...(search
      ? { title: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ── Get single task ───────────────────────────────────────────────────────────

export async function getTaskById(id: string, userId: string) {
  const task = await prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new NotFoundError("Task not found");
  return task;
}

// ── Create task ───────────────────────────────────────────────────────────────

export async function createTask(userId: string, input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status ?? "PENDING",
      userId,
    },
  });
}

// ── Update task ───────────────────────────────────────────────────────────────

export async function updateTask(
  id: string,
  userId: string,
  input: UpdateTaskInput
) {
  const task = await getTaskById(id, userId);

  // Validate status transition if provided
  if (input.status && !isValidTransition(task.status as TaskStatus, input.status)) {
    throw new BadRequestError(
      `Cannot transition task from ${task.status} to ${input.status}`
    );
  }

  return prisma.task.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.status !== undefined && { status: input.status }),
    },
  });
}

// ── Delete task ───────────────────────────────────────────────────────────────

export async function deleteTask(id: string, userId: string) {
  await getTaskById(id, userId);
  await prisma.task.delete({ where: { id } });
}

export async function toggleTask(id: string, userId: string) {
  const task = await getTaskById(id, userId);
  const nextStatus = getNextToggleStatus(task.status as TaskStatus);

  return prisma.task.update({
    where: { id },
    data: { status: nextStatus },
  });
}
