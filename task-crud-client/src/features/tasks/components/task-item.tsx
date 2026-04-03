import React from "react";
import { Task } from "../types";
import { useDeleteTask, useToggleTask } from "../hooks/use-tasks";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  MoreVertical, 
  Pencil, 
  Trash2 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const statusConfig = {
  PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Circle },
  IN_PROGRESS: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
  DONE: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 },
};

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const deleteTask = useDeleteTask();
  const toggleTask = useToggleTask();

  const handleToggle = () => {
    toggleTask.mutate(task.id);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(task.id);
    }
  };

  const StatusIcon = statusConfig[task.status].icon;

  return (
    <Item variant="outline" className="group">
      <ItemMedia>
        <button 
          onClick={handleToggle}
          disabled={toggleTask.isPending}
          className={cn(
            "rounded-full p-0.5 transition-colors focus:outline-none",
            task.status === "DONE" ? "text-green-600" : "text-muted-foreground hover:text-primary"
          )}
        >
          <StatusIcon className="size-5 shrink-0" />
        </button>
      </ItemMedia>
      
      <ItemContent>
        <div className="flex items-center gap-2">
          <ItemTitle className={cn(
            task.status === "DONE" && "line-through text-muted-foreground"
          )}>
            {task.title}
          </ItemTitle>
          <Badge 
            variant="outline" 
            className={cn("text-[10px] py-0 px-1.5 h-4 w-fit font-semibold", statusConfig[task.status].color)}
          >
            {task.status.replace("_", " ")}
          </Badge>
        </div>
        {task.description && (
          <ItemDescription className="line-clamp-1">
            {task.description}
          </ItemDescription>
        )}
      </ItemContent>

      <ItemActions className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-8"
          onClick={() => onEdit(task)}
        >
          <Pencil className="size-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={handleToggle}>
              Toggle Status
            </DropdownMenuItem>
            <DropdownMenuItem 
               onClick={handleDelete}
               className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
}
