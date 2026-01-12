"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTask } from "@/lib/api";

interface Task {
    id: number;
    title: string;
    description?: string | null;
    isFinished: boolean;
    createdAt?: string;
}

interface NewTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTaskCreated: (task: Task) => void;
}

export function NewTaskDialog({ open, onOpenChange, onTaskCreated }: NewTaskDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Název úkolu je povinný");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const newTask = await createTask({
                title: title.trim(),
                description: description.trim() || undefined,
                isFinished: false
            });

            onTaskCreated(newTask);
            setTitle("");
            setDescription("");
            onOpenChange(false);
        } catch (err) {
            setError("Nepodařilo se vytvořit úkol");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>Nový úkol</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">
                            Název *
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Zadej název úkolu..."
                            disabled={isSubmitting}
                            maxLength={255}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">
                            Popis
                        </label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Zadej popis úkolu..."
                            disabled={isSubmitting}
                            rows={4}
                        />
                    </div>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Zrušit
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Vytvářím..." : "Vytvořit"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
