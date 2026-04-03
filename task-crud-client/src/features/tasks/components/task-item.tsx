"use client"

import React from "react";
import { Task, TaskStatus } from "../types";
import { useDeleteTask, useUpdateTask } from "../hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Loader2
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const statusConfig = {
  PENDING: {
    label: "Pending",
    variant: "outline" as const,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50",
    icon: Circle
  },
  IN_PROGRESS: {
    label: "In Progress",
    variant: "outline" as const,
    className: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
    icon: Clock
  },
  DONE: {
    label: "Done",
    variant: "outline" as const,
    className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
    icon: CheckCircle2
  },
};

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { resolvedTheme } = useTheme();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask.mutate({ id: task.id, data: { status: newStatus } });
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id);
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(task.createdAt));

  return (
    <TableRow className="group transition-colors hover:bg-muted/50">
      <TableCell className="">
        <div className="flex flex-col gap-1 px-.5">
          <span className="font-semibold text-sm tracking-tight capitalize">
            {task.title}
          </span>
          {task.description && (
            <span className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
              {task.description}
            </span>
          )}
        </div>
      </TableCell>

      <TableCell>
        <Select
          value={task.status}
          onValueChange={(val) => handleStatusChange(val as TaskStatus)}
          disabled={updateTask.isPending}
        >
          <SelectTrigger className={cn(
            "w-34 border-none px-2 transition-all text-[10px] font-bold uppercase tracking-wider shadow-none focus:ring-0",
            statusConfig[task.status].className
          )}>
            <div className="flex items-center gap-1.5">
              <SelectValue />
            </div>
          </SelectTrigger>

          <SelectContent className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100">
            {Object.entries(statusConfig).map(([key, config]) => (
              <SelectItem
                key={key}
                value={key}
                className="text-xs font-medium cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <config.icon className="size-3" />
                  {config.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell className="hidden md:table-cell text-right px-6">
        <span className="text-xs font-medium text-muted-foreground">
          {formattedDate}
        </span>
      </TableCell>

      <TableCell className="text-right px-.5">
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-8 text-muted-foreground text-primary/60 hover:text-primary hover:bg-primary/5 hover:border-primary/30"
                onClick={() => onEdit(task)}
                disabled={deleteTask.isPending}
              >
                <Pencil className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Edit Task</TooltipContent>
          </Tooltip>

          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-8 text-muted-foreground text-destructive/60 hover:text-destructive hover:bg-destructive/5 hover:border-destructive/30 "
                    disabled={deleteTask.isPending}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">Delete Task</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task
                  "<span className="font-medium text-foreground">{task.title}</span>" from your workspace.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="!bg-destructive !hover:bg-destructive/90 !text-destructive-foreground min-w-[80px]"
                  disabled={deleteTask.isPending}
                >
                  {deleteTask.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="size-4" />
                      Delete
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}
