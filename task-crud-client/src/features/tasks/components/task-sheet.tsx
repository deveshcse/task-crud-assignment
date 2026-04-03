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
  SheetFooter
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

interface TaskSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskSheet({ open, onOpenChange, task }: TaskSheetProps) {
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
      description: null,
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
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Task" : "Create New Task"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update your task details below." : "Add a new task to your list."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="Task title..."
                {...register("title")}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <span className="text-xs text-destructive">{errors.title.message as string}</span>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                id="description"
                placeholder="Optional description..."
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <span className="text-xs text-destructive">{errors.description.message as string}</span>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select 
                onValueChange={(val) => setValue("status", val as TaskStatus)}
                value={status}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <SheetFooter>
            <Button type="submit" disabled={createTask.isPending || updateTask.isPending} className="w-full">
              {isEditing ? "Save Changes" : "Create Task"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
