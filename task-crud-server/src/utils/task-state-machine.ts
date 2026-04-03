import { type TaskStatus } from "../modules/task/task.schema.js";
import { BadRequestError } from "./api-error.js";

/**
 * Validates whether a status transition is allowed.
 * - PENDING → IN_PROGRESS (True)
 * - PENDING → DONE (True)
 * - IN_PROGRESS → DONE (True)
 * - Any move "backwards" is disallowed.
 */
export function isValidTransition(from: TaskStatus, to: TaskStatus): boolean {
  if (from === to) return true;

  if (from === "PENDING") {
    return to === "IN_PROGRESS" || to === "DONE";
  }

  if (from === "IN_PROGRESS") {
    return to === "DONE";
  }

  // If already "DONE", no state changes allowed.
  return false;
}

/**
 * Determines the next status for the "one-way toggle" logic.
 * Path: PENDING → IN_PROGRESS → DONE
 */
export function getNextToggleStatus(current: TaskStatus): TaskStatus {
  if (current === "PENDING") return "IN_PROGRESS";
  if (current === "IN_PROGRESS") return "DONE";
  
  throw new BadRequestError(`Task is already completed (status: ${current})`);
}
