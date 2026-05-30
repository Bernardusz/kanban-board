import { inject, Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskSummary } from './index.server';
import { catchError, debounceTime, EMPTY, Subject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/tasks';


  
  // Local client-side tracking state (starts as null, falls back to server data)
  private _localTasks = signal<Task[] | null>(null);
  
  // Public signal for your component to read
  localTasks = this._localTasks.asReadonly();

  private statusUpdateStream = new Subject<{}>();

  constructor () {
	this.initializeDebouncedStream();
  }

  private initializeDebouncedStream() {
    this.statusUpdateStream.pipe(
      // ⏳ FORCE THE 2-SECOND FRONTEND DELAY
      // It will discard all intermediate actions until the user stops moving cards for 2000ms
      debounceTime(2000),

      // 🚀 Switch to the network call once silence is achieved
      switchMap((update) => {
        console.log(`[Debounce Resolved] Sending tasks to Spring Boot...`);
		
		const current = this._localTasks() ?? [];
		const batchPayload: { id: number; status: string; position: number }[] = [];
		const statuses: ('TODO' | 'PROGRESS' | 'REVIEW' | 'DONE')[] = ['TODO', 'PROGRESS', 'REVIEW', 'DONE'];
		
		statuses.forEach((laneStatus) => {
			const laneTasks = current.filter(t => t.status === laneStatus);
			laneTasks.forEach((task, index) => {
				batchPayload.push({
					id: task.id,
					status: task.status,
					position: index
				});
			});
		});

		return this.http.put<void>(`${this.apiUrl}`, batchPayload).pipe(
          catchError((err) => {
            console.error('Failed to sync with Postgres via Spring Boot:', err);
            // Return EMPTY so the master subscription channel doesn't terminate on network failure
            return EMPTY; 
          })
        );

	  })
	  

    ).subscribe({
      next: () => console.log('Successfully synced with Postgres via Spring Boot!'),
      error: (err) => console.error('Friction syncing state:', err)
    });
  }

  // Initialize the service with the data captured by SSR
  initializeData(serverTasks: Task[]) {
    if (this._localTasks() === null) {
      this._localTasks.set(serverTasks);
    }
  }

  /**
   * 📡 GET: Get a specific task
   */
  getTask(id: number, signal: WritableSignal<TaskSummary | true | null | Task>) {
	return this.http.get<Task>(`${this.apiUrl}/${id}`).subscribe({
		next: (task) => {
			signal.set(task);
		},
		error: (err) => console.error('Failed to lazy-load description:', err)
	});
  }

  /**
   * 🔄 PATCH / PUT: Update task status (on drag-and-drop)
   */
  updateTask(
	taskId: number,
	newStatus: Task['status'],
	prevIndex: number,
	currentIndex: number,
	isSameLane: boolean
  ) {
    // Optimistic Update: Change UI immediately before network response
    const current = this._localTasks() ?? [];

	const targetTask = current.find(t => t.id === taskId);
	if (!targetTask) return;

	const updatedTask: Task = { ...targetTask, status: newStatus };

	const remainingTasks = current.filter(t => t.id !== taskId);

	let finalTasks: Task[] = [];

	if (isSameLane) {
		const laneTasks = current.filter(t => t.status === newStatus);
		
		laneTasks.splice(prevIndex, 1)
		laneTasks.splice(currentIndex, 0, updatedTask);

		finalTasks = [
			...current.filter(t => t.status !== newStatus),
			...laneTasks
		];
	} else {
		
		const targetLaneTasks = remainingTasks.filter(t => t.status === newStatus);

		targetLaneTasks.splice(currentIndex, 0, updatedTask);

		finalTasks = [
			...remainingTasks.filter(t => t.status !== newStatus),
			...targetLaneTasks
		];
	}

    this._localTasks.set(finalTasks);

    // Push the intended update into the debounced stream; actual network call
    // will be made by initializeDebouncedStream after debounceTime.
    this.statusUpdateStream.next({});
  }

  /**
   * ❌ DELETE: Remove a task
   */
  deleteTask(taskId: number) {
    this.http.delete(`${this.apiUrl}/${taskId}`).subscribe({
      next: () => {
        const current = this._localTasks() ?? [];
        this._localTasks.set(current.filter(t => t.id !== taskId));
      },
      error: (err) => console.error('Failed to delete task:', err)
    });
  }
}
