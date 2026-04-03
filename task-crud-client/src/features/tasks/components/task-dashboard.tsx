"use client"

import React, { useState } from "react";
import { useTasks } from "../hooks/use-tasks";
import { TaskItem } from "./task-item";
import { TaskSheet } from "./task-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Loader2, 
  SearchX 
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemGroup } from "@/components/ui/item";
import { Task, TaskStatus } from "../types";
import { cn } from "@/lib/utils";

export function TaskDashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data, isLoading, isError } = useTasks({
    search: search || undefined,
    status: status === "all" ? undefined : status,
  });

  const handleCreate = () => {
    setEditingTask(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsSheetOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full py-10 px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Your Tasks</h1>
          <p className="text-muted-foreground text-sm">
            Manage, track and organize your daily work.
          </p>
        </div>
        <Button onClick={handleCreate} className="w-fit shadow-lg shadow-primary/20">
          <Plus className="mr-2 size-4" />
          New Task
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card/50 p-2 rounded-xl border">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-9 h-10 border-none bg-transparent focus-visible:ring-0" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="h-6 w-px bg-border hidden md:block" />

        <Tabs 
          value={status} 
          onValueChange={(val) => setStatus(val as any)} 
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-4 h-10 bg-transparent border">
            <TabsTrigger value="all" className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
               All
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
               Pending
            </TabsTrigger>
            <TabsTrigger value="IN_PROGRESS" className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
               InProgress
            </TabsTrigger>
            <TabsTrigger value="DONE" className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm">
               Done
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary/60" />
            <p className="text-sm">Loading your tasks...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 border-2 border-dashed rounded-2xl bg-destructive/5">
            <p className="text-destructive font-medium">Failed to load tasks</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : (data as any)?.tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 p-12 text-center bg-card rounded-2xl border-2 border-dashed">
            <div className="p-4 rounded-full bg-muted">
              <SearchX className="size-8 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-lg">No tasks found</p>
              <p className="text-muted-foreground text-sm max-w-xs">
                {search || status !== "all" 
                  ? "Try adjusting your filters or search terms." 
                  : "Start growing your productivity by adding your first task today!"}
              </p>
            </div>
            {!search && status === "all" && (
                <Button onClick={handleCreate} variant="outline" size="sm">Create Task</Button>
            )}
          </div>
        ) : (
          <ItemGroup>
             {(data as any)?.tasks.map((task: Task) => (
               <TaskItem key={task.id} task={task} onEdit={handleEdit} />
             ))}
          </ItemGroup>
        )}
      </div>

      <TaskSheet 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        task={editingTask} 
      />
    </div>
  );
}
