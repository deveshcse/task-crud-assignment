import { useAppMutation } from "@/shared/lib/query-helper";
import { authStore } from "@/features/auth/store/auth-store";
import { User, AuthResponse } from "@/features/auth/types";
import { useAuthContext } from "@/features/auth/components/auth-provider";
import { useRouter } from "next/navigation";
import { 
  ForgotPasswordInput, 
  ResetPasswordInput, 
  LoginInput, 
  RegisterInput 
} from "@/shared/schemas/auth-schema";

export const useAuth = () => {
  const { setUser, setIsAuthenticated } = useAuthContext();
  const router = useRouter();

  const loginMutation = useAppMutation<AuthResponse, any, LoginInput>({
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

  const registerMutation = useAppMutation<AuthResponse, any, RegisterInput>({
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

  const forgotPasswordMutation = useAppMutation<any, any, ForgotPasswordInput>({
    url: "/auth/forgot-password",
    method: "POST",
    successMessage: "If an account exists, a reset link has been sent.",
  });

  const resetPasswordMutation = useAppMutation<any, any, ResetPasswordInput>({
    url: "/auth/reset-password",
    method: "POST",
    successMessage: "Password reset successfully! Please login.",
    onSuccess: () => {
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
    forgotPassword: forgotPasswordMutation.mutate,
    isForgetting: forgotPasswordMutation.isPending,
    isForgotSuccess: forgotPasswordMutation.isSuccess,
    resetPassword: resetPasswordMutation.mutate,
    isResetting: resetPasswordMutation.isPending,
  };
};
