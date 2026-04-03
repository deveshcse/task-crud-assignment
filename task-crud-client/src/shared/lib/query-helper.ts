import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
} from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import apiClient from "@/shared/api/api-client";

// --- Types ---

interface AppQueryOptions<TQueryFnData = unknown, TError = AxiosError, TData = TQueryFnData> {
  url: string;
  queryKey: QueryKey;
  params?: Record<string, any>;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  successMessage?: string;
  errorMessage?: string;
  config?: Omit<UseQueryOptions<TQueryFnData, TError, TData>, 'queryKey' | 'queryFn'>;
}

interface AppMutationOptions<TData = unknown, TError = AxiosError, TVariables = void, TContext = unknown> {
  url: string;
  method: "POST" | "PATCH" | "PUT" | "DELETE";
  onSuccess?: (data: TData, variables: TVariables, context: TContext) => void;
  onError?: (error: TError, variables: TVariables, context: TContext) => void;
  successMessage?: string;
  errorMessage?: string;
  config?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'>;
}

// --- Query Helper ---

export const useAppQuery = <TQueryFnData = any, TError = AxiosError, TData = TQueryFnData>({
  url,
  queryKey,
  params,
  onSuccess,
  onError,
  successMessage,
  errorMessage,
  config,
}: AppQueryOptions<TQueryFnData, TError, TData>) => {
  return useQuery<TQueryFnData, TError, TData>({
    queryKey,
    queryFn: async () => {
      try {
        const response = await apiClient.get(url, { params });
        const data = response.data.data;
        if (successMessage) toast.success(successMessage);
        onSuccess?.(data);
        return data;
      } catch (error) {
        const axiosError = error as TError;
        if (errorMessage) toast.error(errorMessage);
        onError?.(axiosError);
        throw axiosError;
      }
    },
    ...config,
  });
};

// --- Mutation Helper ---

export const useAppMutation = <TData = any, TError = AxiosError, TVariables = any, TContext = any>({
  url,
  method,
  onSuccess,
  onError,
  successMessage,
  errorMessage,
  config,
}: AppMutationOptions<TData, TError, TVariables, TContext>) => {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: async (variables) => {
      const axiosConfig: AxiosRequestConfig = {
        method,
        url,
        data: variables,
      };
      
      const response = await apiClient(axiosConfig);
      return response.data.data;
    },
    onSuccess: (data, variables, context) => {
        if (successMessage) toast.success(successMessage);
        onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
        if (errorMessage) toast.error(errorMessage || (error as any)?.response?.data?.message || "Something went wrong");
        onError?.(error, variables, context as TContext);
    },
    ...config,
  });
};
