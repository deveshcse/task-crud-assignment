"use client"

import React, { useState } from "react";
import { useTasks } from "../hooks/use-tasks";
import { TaskItem } from "./task-item";
import { TaskCreateUpdateForm } from "./task-create-update-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { 
  Plus, 
  Search, 
  Loader2, 
  SearchX,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task, TaskStatus } from "../types";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TaskDashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [page, setPage] = useState(1);
  const limit = 7;

  const { data, isLoading, isError } = useTasks({
    search: search || undefined,
    status: status === "all" ? undefined : status,
    page,
    limit
  });

  const handleCreate = () => {
    setEditingTask(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsSheetOpen(true);
  };

  const tasks = (data as any)?.tasks || [];
  const totalPages = (data as any)?.totalPages || 1;

  React.useEffect(() => {
    setPage(1);
  }, [search, status]);

  return (
    <div className="flex flex-col gap-6 w-full px-8 pt-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground/90">Your Workspace</h1>
          <p className="text-muted-foreground text-xs font-medium">
            Stay organized and keep track of your team's progress.
          </p>
        </div>
        <Button onClick={handleCreate} className="w-fit">
          <Plus className="mr-2 size-4" />
          New Task
        </Button>
      </div>

      {/* Controls */}
      <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-2 border shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
          <Input 
            placeholder="Search tasks by title..." 
            className="pl-9 border bg-transparent focus-visible:ring-0 shadow-none text-base" 
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="w-full bg-border h-px md:hidden"></div>

        <Tabs 
          value={status} 
          onValueChange={(val) => setStatus(val as any)} 
          className="w-full md:w-auto items-center justify-between"
        >
          <TabsList className="w-full grid grid-cols-4 items-center justify-center bg-muted/50 border-none p-1">
            <TabsTrigger value="all" className="text-xs border font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
               All
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="text-xs font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
               Pending
            </TabsTrigger>
            <TabsTrigger value="IN_PROGRESS" className="text-xs font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
               Active
            </TabsTrigger>
            <TabsTrigger value="DONE" className="text-xs font-bold data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg">
               Done
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table Container */}
      <div className="border bg-card shadow-sm overflow-hidden h-full flex flex-col justify-between">
        <div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-120 gap-3 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-semibold animate-pulse">Synchronizing tasks...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-120 gap-4 p-8 text-center bg-destructive/5">
              <p className="text-destructive font-bold text-lg">System Sync Error</p>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto -mt-2">We couldn't reach the database.</p>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="border-destructive/20 text-destructive hover:bg-destructive/10">Retry Connection</Button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-120 gap-6 text-center">
              <div className="p-6 rounded-3xl bg-muted/50 text-muted-foreground/30 ring-1 ring-border">
                <SearchX className="size-12" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-bold text-2xl tracking-tight text-foreground/80">No matches found</p>
                <p className="text-muted-foreground font-medium text-sm max-w-xs mx-auto px-4 leading-relaxed">
                  {search || status !== "all" 
                    ? "We couldn't find any tasks matching your current filters." 
                    : "Your workspace is currently empty."}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="w-1/2 font-bold px-2 text-foreground/70 uppercase text-xs tracking-widest">Task Details</TableHead>
                  <TableHead className="w-1/4 font-bold text-foreground/70 uppercase text-xs tracking-widest">Status</TableHead>
                  <TableHead className="hidden md:table-cell font-bold text-foreground/70 uppercase text-xs tracking-widest text-right px-6">Timeline</TableHead>
                  <TableHead className="text-right font-bold px-2 text-foreground/70 uppercase text-xs tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task: Task) => (
                  <TaskItem key={task.id} task={task} onEdit={handleEdit} />
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination Footer */}
        {!isLoading && !isError && tasks.length > 0 && (
          <div className="px-2 py-2 border-t bg-muted/10 flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Page {page} of {totalPages}
            </p>
            <Pagination className="w-auto mx-0">
                <PaginationContent className="gap-1">
                    <PaginationItem>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="h-8 w-8"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Previous Page</TooltipContent>
                        </Tooltip>
                    </PaginationItem>
                    
                    

                    <PaginationItem>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="h-8 w-8"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Next Page</TooltipContent>
                        </Tooltip>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <TaskCreateUpdateForm 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        task={editingTask} 
      />
    </div>
  );
}
