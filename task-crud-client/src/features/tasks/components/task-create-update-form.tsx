"use client"

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTaskSchema, CreateTaskInput, TaskStatus } from "@/shared/schemas/task-schema";
import { Task } from "../types";
import { useCreateTask, useUpdateTask } from "../hooks/use-tasks";

interface TaskCreateUpdateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskCreateUpdateForm({ open, onOpenChange, task }: TaskCreateUpdateFormProps) {
  const isEditing = !!task;
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "PENDING",
    },
  });

  const status = watch("status");

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "PENDING",
      });
    }
  }, [task, reset, open]);

  const onSubmit = (data: CreateTaskInput) => {
    if (isEditing && task) {
      updateTask.mutate({ id: task.id, data }, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      createTask.mutate(data, {
        onSuccess: () => onOpenChange(false)
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full data-[side=right]:sm:max-w-xl">
        <SheetHeader className="pb-6 border-b">
          <SheetTitle className="font-bold">{isEditing ? "Edit Task" : "Create New Task"}</SheetTitle>
          <SheetDescription className="text-xs">
            {isEditing ? "Update your task details and status below." : "Add a fresh task to your workspace."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-8">
          <FieldGroup className="space-y-6 p-4">
            <Field>
              <FieldLabel htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Title</FieldLabel>
              <Input
                id="title"
                placeholder="What needs to be done?"
                className="h-12 text-base focus-visible:ring-primary/20"
                {...register("title")}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <span className="text-xs font-medium text-destructive">{errors.title.message as string}</span>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Description</FieldLabel>
              <Input
                id="description"
                placeholder="Add more details (optional)..."
                className="h-12 text-base focus-visible:ring-primary/20"
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <span className="text-xs font-medium text-destructive">{errors.description.message as string}</span>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="status" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Status</FieldLabel>
              <Select 
                onValueChange={(val) => setValue("status", val as TaskStatus)}
                value={status}
              >
                <SelectTrigger id="status" className="h-12 text-base shadow-none">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING" className="py-3">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS" className="py-3">In Progress</SelectItem>
                  <SelectItem value="DONE" className="py-3">Done</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <SheetFooter className="pt-6 border-t mt-auto"> 
            <Button 
                type="submit" 
                disabled={createTask.isPending || updateTask.isPending} 
                className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20"
            >
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
