"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getTask, updateTaskStatus, deleteTask } from "@/lib/api";

interface Task {
    id: number;
    title: string;
    description?: string | null;
    isFinished: boolean;
    createdAt?: string;
}

interface TaskDetailDialogProps {
    taskId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTaskUpdated: (task: Task) => void;
    onTaskDeleted: (taskId: number) => void;
}

export function TaskDetailDialog({
    taskId,
    open,
    onOpenChange,
    onTaskUpdated,
    onTaskDeleted
}: TaskDetailDialogProps) {
    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open && taskId) {
            loadTask();
        }
    }, [open, taskId]);

    const loadTask = async () => {
        if (!taskId) return;

        setIsLoading(true);
        setError("");

        try {
            const fetchedTask = await getTask(taskId);
            setTask(fetchedTask);
        } catch (err) {
            setError("Nepodařilo se načíst úkol");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!task) return;

        try {
            setError("");
            const updatedTask = await updateTaskStatus(task.id, !task.isFinished);
            setTask(updatedTask);
            onTaskUpdated(updatedTask);
        } catch (err) {
            setError("Nepodařilo se aktualizovat úkol");
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!task) return;

        try {
            setError("");
            await deleteTask(task.id);
            onTaskDeleted(task.id);
            onOpenChange(false);
        } catch (err) {
            setError("Nepodařilo se smazat úkol");
            console.error(err);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString("cs-CZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-150">
                {isLoading ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Detail úkolu</DialogTitle>
                        </DialogHeader>
                        <div className="py-8 text-center text-muted-foreground">
                            Načítám úkol...
                        </div>
                    </>
                ) : task ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl">{task.title}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={task.isFinished}
                                    onCheckedChange={handleToggleStatus}
                                />
                                <span className="text-sm font-medium">
                                    {task.isFinished ? "Dokončeno" : "Nedokončeno"}
                                </span>
                            </div>

                            {task.description && (
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Popis</h3>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded-md">
                                        {task.description}
                                    </p>
                                </div>
                            )}

                            {task.createdAt && (
                                <div>
                                    <h3 className="text-sm font-medium mb-1">Vytvořeno</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(task.createdAt)}
                                    </p>
                                </div>
                            )}

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    className="flex-1"
                                >
                                    Smazat
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    className="flex-1"
                                >
                                    Zavřít
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Detail úkolu</DialogTitle>
                        </DialogHeader>
                        <div className="py-8 text-center text-muted-foreground">
                            Úkol nenalezen
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
