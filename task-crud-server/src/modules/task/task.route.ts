import { Router } from "express";
import * as taskController from "./task.controller.js";
import { authenticate } from "../../middleware/authenticate.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  listTasksQuerySchema,
} from "./task.schema.js";

const router = Router();

// All task routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management — CRUD + toggle
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: List tasks (paginated, filterable, searchable)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10, maximum: 50 }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, IN_PROGRESS, DONE] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Case-insensitive search on task title
 *     responses:
 *       200:
 *         description: Paginated task list
 *       401:
 *         description: Unauthorized
 */
router.get("/", validate(listTasksQuerySchema), taskController.getTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, DONE]
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", validate(createTaskSchema), taskController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 */
router.get("/:id", validate(taskIdParamSchema), taskController.getTask);

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, DONE]
 *     responses:
 *       200:
 *         description: Task updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Task not found
 */
router.patch("/:id", validate(updateTaskSchema), taskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
router.delete("/:id", validate(taskIdParamSchema), taskController.deleteTask);

/**
 * @swagger
 * /tasks/{id}/toggle:
 *   patch:
 *     summary: Toggle task status (PENDING → IN_PROGRESS → DONE → PENDING)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Status toggled
 *       404:
 *         description: Task not found
 */
router.patch("/:id/toggle", validate(taskIdParamSchema), taskController.toggleTask);

export default router;
