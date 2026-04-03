import { useAppMutation } from "@/shared/lib/query-helper";
import { authStore } from "@/features/auth/store/auth-store";
import { User, AuthResponse } from "@/features/auth/types";
import { useAuthContext } from "@/features/auth/components/auth-provider";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { setUser, setIsAuthenticated } = useAuthContext();
  const router = useRouter();

  const loginMutation = useAppMutation<AuthResponse, any, any>({
    url: "/auth/login",
    method: "POST",
    successMessage: "Logged in successfully!",
    errorMessage: "Login failed. Please check your credentials.",
    onSuccess: (data) => {
      authStore.setToken(data.accessToken);
      setUser(data.user);
      setIsAuthenticated(true);
      router.push("/tasks");
    },
  });

  const registerMutation = useAppMutation<AuthResponse, any, any>({
    url: "/auth/register",
    method: "POST",
    successMessage: "Account created successfully!",
    errorMessage: "Registration failed. Please try again.",
    onSuccess: (data) => {
      authStore.setToken(data.accessToken);
      setUser(data.user);
      setIsAuthenticated(true);
      router.push("/tasks");
    },
  });

  const logoutMutation = useAppMutation({
    url: "/auth/logout",
    method: "POST",
    successMessage: "Logged out successfully!",
    onSuccess: () => {
      authStore.clearToken();
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    },
  });

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};
