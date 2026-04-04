import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useAppQuery, useAppMutation } from "@/shared/lib/query-helper";
import { Task, TaskResponse, CreateTaskInput, UpdateTaskInput, TaskStatus } from "../types";

export const TASK_KEYS = {
  all: ["tasks"] as const,
  lists: () => [...TASK_KEYS.all, "list"] as const,
  list: (params: {
    page?: number;
    limit?: number;
    status?: TaskStatus;
    search?: string;
  }) =>
    [
      ...TASK_KEYS.lists(),
      params.page ?? null,
      params.limit ?? null,
      params.status ?? null,
      params.search ?? null,
    ] as const,
};


export const useTasks = (params: {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  search?: string;
}) => {
    const queryKey = TASK_KEYS.list(params);

    return useAppQuery<TaskResponse>({
        url: "/tasks",
        queryKey,
        params,
        config: {
            refetchOnMount: "always",
        },
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useAppMutation<Task, AxiosError, CreateTaskInput>({
        url: "/tasks",
        method: "POST",
        successMessage: "Task created successfully",
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() });
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useAppMutation<Task, AxiosError, { id: string; data: UpdateTaskInput }>({
        successMessage: "Task updated successfully",
        config: {
            mutationFn: async ({ id, data }) => {
                const apiClient = (await import("@/shared/api/api-client")).default;
                const response = await apiClient.patch(`/tasks/${id}`, data);
                return response.data.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() });
            },
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useAppMutation<void, AxiosError, string>({
        successMessage: "Task deleted successfully",
        config: {
            mutationFn: async (id: string) => {
                const apiClient = (await import("@/shared/api/api-client")).default;
                await apiClient.delete(`/tasks/${id}`);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() });
            },
        },
    });
};

export const useToggleTask = () => {
    const queryClient = useQueryClient();
    return useAppMutation<Task, AxiosError, string>({
        successMessage: "Task status updated",
        config: {
            mutationFn: async (id: string) => {
                const apiClient = (await import("@/shared/api/api-client")).default;
                const response = await apiClient.patch(`/tasks/${id}/toggle`);
                return response.data.data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: TASK_KEYS.lists() });
            },
        },
    });
};
