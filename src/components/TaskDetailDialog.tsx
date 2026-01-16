"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getTask, updateTaskStatus, deleteTask, updateTask } from "@/lib/api";

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
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        if (open && taskId) {
            loadTask();
        } else {
            setIsEditing(false);
        }
    }, [open, taskId]);

    const loadTask = async () => {
        if (!taskId) return;

        setIsLoading(true);
        setError("");

        try {
            const fetchedTask = await getTask(taskId);
            setTask(fetchedTask);
            setEditTitle(fetchedTask.title);
            setEditDescription(fetchedTask.description || "");
        } catch (err) {
            setError("Nepodařilo se načíst úkol");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!task) return;

        if (!editTitle.trim()) {
            setError("Název nesmí být prázdný");
            return;
        }

        try {
            setError("");
            const updatedTask = await updateTask(task.id, {
                title: editTitle.trim(),
                description: editDescription.trim() || undefined,
            });
            setTask(updatedTask);
            onTaskUpdated(updatedTask);
            setIsEditing(false);
        } catch (err) {
            setError("Nepodařilo se upravit úkol");
            console.error(err);
        }
    };

    const handleCancelEdit = () => {
        if (task) {
            setEditTitle(task.title);
            setEditDescription(task.description || "");
        }
        setIsEditing(false);
        setError("");
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('cs-CZ');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
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
                            <DialogTitle className="text-2xl">
                                {isEditing ? "Upravit úkol" : task.title}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            {isEditing ? (
                                <>
                                    <div>
                                        <h3 className="text-sm font-medium mb-2">Název</h3>
                                        <Input
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            placeholder="Název úkolu"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium mb-2">Popis</h3>
                                        <Textarea
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            placeholder="Popis úkolu (nepovinné)"
                                            rows={5}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={task.isFinished}
                                            onCheckedChange={handleToggleStatus}
                                        />
                                        <span className="text-sm font-medium">
                                            {task.isFinished ? "Dokončeno" : "Nedokončeno"}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium mb-2">Popis</h3>
                                        {task.description ? (
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded-md">
                                                {task.description}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">
                                                Žádný popis
                                            </p>
                                        )}
                                    </div>

                                    {task.createdAt && (
                                        <div>
                                            <h3 className="text-sm font-medium mb-1">Vytvořeno</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(task.createdAt)}
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-2 pt-4">
                                {isEditing ? (
                                    <>
                                        <Button
                                            onClick={handleSaveEdit}
                                            className="flex-1"
                                        >
                                            Uložit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancelEdit}
                                            className="flex-1"
                                        >
                                            Zrušit
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditing(true)}
                                            className="flex-1"
                                        >
                                            Upravit
                                        </Button>
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
                                    </>
                                )}
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
