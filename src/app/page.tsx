"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Todo {
  text: string;
  done: boolean;
}

export default function DailyTodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [shakeId, setShakeId] = useState<number | null>(null);

  const todayKey = `daily-todo-${new Date().toISOString().slice(0, 10)}`;

  useEffect(() => {
    const stored = localStorage.getItem(todayKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.length > 0 && typeof parsed[0] === 'string') {
        setTodos(parsed.map((text: string) => ({ text, done: false })));
      } else {
        setTodos(parsed);
      }
    }
  }, [todayKey]);

  useEffect(() => {
    localStorage.setItem(todayKey, JSON.stringify(todos));
  }, [todos, todayKey]);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { text: input.trim(), done: false }]);
    setInput("");
  };

  const toggleTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].done = !newTodos[index].done;
    setTodos(newTodos);
    setShakeId(index);
    setTimeout(() => setShakeId(null), 400);
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen flex justify-center bg-muted p-4">
      <Card className="w-full rounded-2xl shadow-md">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-semibold">Daily Todo</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US")}
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="What do you want to do today?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
            />
            <Button onClick={addTodo}>Add</Button>
          </div>

          <ul className="space-y-2">
            {todos.map((todo, i) => (
              <li
                key={i}
                className={`flex items-center gap-3 rounded-xl bg-background px-3 py-2 shadow-sm ${shakeId === i ? 'shake' : ''}`}
              >
                <Checkbox
                  checked={todo.done}
                  onCheckedChange={() => toggleTodo(i)}
                />
                <span className={`text-3xl flex-1 font-(family-name:--font-just-another-hand) ${todo.done ? 'line-through opacity-60' : ''}`}>
                  {todo.text}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTodo(i)}
                >
                  ✕
                </Button>
              </li>
            ))}
          </ul>

          {todos.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No tasks yet. Add one above!
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
