"use client"

import { AuthGuard } from "@/features/auth/components/auth-guard"
import { TaskDashboard } from "@/features/tasks/components/task-dashboard"

export default function TasksPage() {
  return (
    <AuthGuard>
      <main className="min-h-svh bg-background">
        <TaskDashboard />
      </main>
    </AuthGuard>
  )
}
