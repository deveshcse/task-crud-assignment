import { type Request, type Response, type NextFunction } from "express";
import * as taskService from "./task.service.js";
import { sendSuccess } from "../../utils/api-response.js";
import {
  type CreateTaskInput,
  type UpdateTaskInput,
  type ListTasksQuery,
} from "./task.schema.js";

// ── GET /api/v1/tasks ─────────────────────────────────────────────────────────

export async function getTasks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as ListTasksQuery;
    const result = await taskService.getTasks(req.user.userId, query);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

// ── GET /api/v1/tasks/:id ─────────────────────────────────────────────────────

export async function getTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params["id"] as string;
    const task = await taskService.getTaskById(id, req.user.userId);
    sendSuccess(res, { task });
  } catch (error) {
    next(error);
  }
}

// ── POST /api/v1/tasks ────────────────────────────────────────────────────────

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as CreateTaskInput;
    const task = await taskService.createTask(req.user.userId, input);
    sendSuccess(res, { task }, 201);
  } catch (error) {
    next(error);
  }
}

// ── PATCH /api/v1/tasks/:id ───────────────────────────────────────────────────

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params["id"] as string;
    const input = req.body as UpdateTaskInput;
    const task = await taskService.updateTask(id, req.user.userId, input);
    sendSuccess(res, { task });
  } catch (error) {
    next(error);
  }
}

// ── DELETE /api/v1/tasks/:id ──────────────────────────────────────────────────

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params["id"] as string;
    await taskService.deleteTask(id, req.user.userId);
    sendSuccess(res, { message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
}

// ── PATCH /api/v1/tasks/:id/toggle ───────────────────────────────────────────

export async function toggleTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params["id"] as string;
    const task = await taskService.toggleTask(id, req.user.userId);
    sendSuccess(res, { task });
  } catch (error) {
    next(error);
  }
}
