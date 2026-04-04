"use client"

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
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
import { Plus, Loader2, Save } from "lucide-react";

const TASK_STATUSES = ["PENDING", "IN_PROGRESS", "DONE"] as const;

function isTaskStatus(value: string): value is TaskStatus {
  return (TASK_STATUSES as readonly string[]).includes(value);
}

type TaskFormValues = CreateTaskInput;

interface TaskCreateUpdateFormProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly task?: Task | null;
}

export function TaskCreateUpdateForm({
  open,
  onOpenChange,
  task,
}: Readonly<TaskCreateUpdateFormProps>) {
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
  } = useForm<TaskFormValues>({
    resolver: zodResolver(createTaskSchema) as Resolver<TaskFormValues>,
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

  const submitTask = (data: TaskFormValues, options: { shouldClose: boolean }) => {
    if (isEditing && task) {
      updateTask.mutate(
        { id: task.id, data },
        {
          onSuccess: () => onOpenChange(false),
        }
      );
      return;
    }
    createTask.mutate(data, {
      onSuccess: () => {
        if (options.shouldClose) {
          onOpenChange(false);
        } else {
          reset({
            title: "",
            description: "",
            status: "PENDING",
          });
        }
      },
    });
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
        <form
          onSubmit={handleSubmit((data) => submitTask(data, { shouldClose: true }))}
          className="space-y-8 py-8"
        >
          <FieldGroup className="space-y-4 p-4">
            <Field>
              <FieldLabel htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Title</FieldLabel>
              <Input
                id="title"
                placeholder="What needs to be done?"
                className="text-base focus-visible:ring-primary/20"
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
                className="text-base focus-visible:ring-primary/20"
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
                onValueChange={(val) => {
                  if (isTaskStatus(val)) {
                    setValue("status", val);
                  }
                }}
                value={status}
              >
                <SelectTrigger id="status" >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING" >Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS" >In Progress</SelectItem>
                  <SelectItem value="DONE" >Done</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <SheetFooter className="border-t flex flex-row items-center justify-between gap-3 mt-auto absolute bottom-0 left-0 right-0"> 
            {isEditing ? (
              <Button 
                type="submit" 
                onClick={handleSubmit((data) => submitTask(data, { shouldClose: true }))}
                disabled={updateTask.isPending} 
                className="min-w-[140px]  text-sm font-bold shadow-lg shadow-primary/20"
              >
                {updateTask.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                Save Changes
              </Button>
            ) : (
              <>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleSubmit((data) => submitTask(data, { shouldClose: false }))}
                  disabled={createTask.isPending} 
                  className="min-w-25 "
                >
                  {createTask.isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 size-4" />
                  )}
                  Create
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleSubmit((data) => submitTask(data, { shouldClose: true }))}
                  disabled={createTask.isPending} 
                  className="min-w-[140px] "
                >
                  {createTask.isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 size-4" />
                  )}
                  Create & Close
                </Button>
              </>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
