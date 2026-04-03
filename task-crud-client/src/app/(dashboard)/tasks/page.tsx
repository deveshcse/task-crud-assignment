import { AuthGuard } from "@/features/auth/components/auth-guard"
import { TaskDashboard } from "@/features/tasks/components/task-dashboard"
import { Header } from "@/shared/components/header";

export default function TasksPage() {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-svh bg-background">
        <Header />
        <main className="flex-1 px-4 py-8 sm:px-8">
            <div className="mx-auto max-w-5xl">
                <TaskDashboard />
            </div>
        </main>
      </div>
    </AuthGuard>
  )
}
