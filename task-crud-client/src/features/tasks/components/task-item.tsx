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
  MoreHorizontal
} from "lucide-react";
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
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask.mutate({ id: task.id, data: { status: newStatus } });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(task.id);
    }
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(task.createdAt));

  return (
    <TableRow className="group transition-colors hover:bg-muted/50">
      <TableCell className="">
        <div className="flex flex-col gap-1">
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
          <SelectTrigger className="h-8 w-32 border-none bg-transparent hover:bg-muted focus:ring-0 shadow-none px-0">
            <SelectValue>
              <Badge 
                variant={statusConfig[task.status].variant} 
                className={cn("text-[0.625rem] font-bold uppercase tracking-wider", statusConfig[task.status].className)}
              >
                {statusConfig[task.status].label}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusConfig).map(([key, config]) => (
              <SelectItem key={key} value={key} className="text-xs font-medium">
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

      <TableCell className="text-right px-6">
        <div className="flex items-center justify-end gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/30"
                onClick={() => onEdit(task)}
              >
                <Pencil className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Edit Task</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 hover:border-destructive/30"
                onClick={handleDelete}
                disabled={deleteTask.isPending}
              >
                <Trash2 className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Delete Task</TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}
