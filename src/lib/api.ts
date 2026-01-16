import { getAuthToken } from './auth';

// const API_BASE_URL = 'https://daily-todo-api.gryvdycz.workers.dev';
const API_BASE_URL = 'http://127.0.0.1:8787';

interface Task {
    id: number;
    title: string;
    description?: string | null;
    isFinished: boolean;
    createdAt?: string;
}

interface CreateTaskData {
    title: string;
    description?: string;
    isFinished?: boolean;
}

interface UpdateTaskData {
    title?: string;
    description?: string;
    isFinished?: boolean;
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = getAuthToken();

    if (!token) {
        throw new Error('No authentication token found');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

export async function getTasks(): Promise<Task[]> {
    const data = await fetchWithAuth('/task/get');
    return data.tasks || [];
}

export async function getTask(taskId: number): Promise<Task> {
    const data = await fetchWithAuth(`/task/get/${taskId}`);
    return data.tasks[0];
}

export async function createTask(taskData: CreateTaskData): Promise<Task> {
    const data = await fetchWithAuth('/task/new', {
        method: 'POST',
        body: JSON.stringify(taskData),
    });
    return data.task;
}

export async function updateTask(taskId: number, taskData: UpdateTaskData): Promise<Task> {
    const data = await fetchWithAuth(`/task/update/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(taskData),
    });
    return data.updatedTask;
}

export async function updateTaskStatus(taskId: number, isFinished: boolean): Promise<Task> {
    const data = await fetchWithAuth(`/task/update/status/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isFinished }),
    });
    return data.updatedTask;
}

export async function deleteTask(taskId: number): Promise<void> {
    await fetchWithAuth(`/task/delete/${taskId}`, {
        method: 'DELETE',
    });
}
