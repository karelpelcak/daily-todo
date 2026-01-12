"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { getTasks, updateTaskStatus } from "@/lib/api";
import { NewTaskDialog } from "@/components/NewTaskDialog";
import { TaskDetailDialog } from "@/components/TaskDetailDialog";

interface Task {
  id: number;
  title: string;
  description?: string | null;
  isFinished: boolean;
  createdAt?: string;
}

export default function DailyTodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [shakeId, setShakeId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const { logout, isLoading } = useAuth();

  const loadTasks = async () => {
    try {
      setError("");
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError("Nepodařilo se načíst úkoly");
      console.error(err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskCreated = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskDeleted = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTodo = async (taskId: number, currentStatus: boolean) => {
    try {
      setError("");
      await updateTaskStatus(taskId, !currentStatus);
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, isFinished: !currentStatus } : task
      ));
      setShakeId(taskId);
      setTimeout(() => setShakeId(null), 400);
    } catch (err) {
      setError("Nepodařilo se aktualizovat úkol");
      console.error(err);
    }
  };

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex justify-center items-center bg-muted">
        <p>Načítám...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex justify-center bg-muted p-4">
      <Card className="w-full rounded-2xl shadow-md">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Daily Todo</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
            >
              Odhlásit se
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("cs-CZ")}
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button
            onClick={() => setIsNewTaskDialogOpen(true)}
            className="w-full"
          >
            + Přidat nový úkol
          </Button>

          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center gap-3 rounded-xl bg-background px-3 py-2 shadow-sm ${shakeId === task.id ? 'shake' : ''}`}
              >
                <Checkbox
                  checked={task.isFinished}
                  onCheckedChange={() => toggleTodo(task.id, task.isFinished)}
                />
                <span
                  className={`text-3xl flex-1 font-(family-name:--font-tillana) cursor-pointer ${task.isFinished ? 'line-through opacity-60' : ''}`}
                  onClick={() => handleTaskClick(task.id)}
                >
                  {task.title}
                </span>
              </li>
            ))}
          </ul>

          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No tasks yet. Add one above!
            </p>
          )}
        </CardContent>
      </Card>

      <NewTaskDialog
        open={isNewTaskDialogOpen}
        onOpenChange={setIsNewTaskDialogOpen}
        onTaskCreated={handleTaskCreated}
      />

      <TaskDetailDialog
        taskId={selectedTaskId}
        open={selectedTaskId !== null}
        onOpenChange={(open) => !open && setSelectedTaskId(null)}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />
    </main>
  );
}
