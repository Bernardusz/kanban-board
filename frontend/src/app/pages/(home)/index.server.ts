import type { PageServerLoad } from '@analogjs/router';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'TODO' | 'PROGRESS' | 'REVIEW' | 'DONE';
  createdAt: string;
  updatedAt: string;
}

export const load = async ({ fetch }: PageServerLoad) => {
  const backendUrl = 'http://localhost:8080/api/tasks';

  try {
    // 🚀 Use the built-in server-side fetch handler
    const tasks = await fetch<Task[]>(backendUrl);

    return { tasks };
  } catch (error) {
    console.error('Error in index.server.ts:', error);
    return {
      tasks: [] as Task[],
      error: 'Failed to pre-render tasks from backend.'
    };
  }
};
