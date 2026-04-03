import { AuthGuard } from "@/features/auth/components/auth-guard"
import { TaskDashboard } from "@/features/tasks/components/task-dashboard"
import { Header } from "@/shared/components/header";

export default function TasksPage() {
  return (
    <AuthGuard>
      <Header />
      <TaskDashboard />
    </AuthGuard>
  )
}
