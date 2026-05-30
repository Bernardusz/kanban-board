import { Component, computed, inject, signal } from '@angular/core';
import {
	CdkDragDrop,
	CdkDropListGroup,
	CdkDrag,
	CdkDropList,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop';
import { injectLoad } from '@analogjs/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { load, type Task, TaskSummary } from '@/app/pages/(home)/index.server';
import { KanbanService } from '@/app/pages/(home)/index.service';
import TaskContainer from '@/components/task-container.component';
import TaskUpdate from '@/components/task-update.component';
import TaskSheet from '@/components/task-sheet.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CdkDropListGroup, TaskContainer, TaskSheet, TaskUpdate, JsonPipe],
  templateUrl: './index.page.html',
})
export default class Home {
	private loader = toSignal(injectLoad<typeof load>(), {requireSync: true});
	private kanbanService = inject(KanbanService);

	constructor() {
		const tasks = this.loader().tasks ?? [];
		this.kanbanService.initializeData(tasks);
	}

	tasksSignal = computed(() => {
		return this.kanbanService.localTasks() ?? this.loader().tasks ?? [];
	});

	todoTasks = computed(() => {
		return this.tasksSignal().filter((task) => task.status === 'TODO');
	});
	inProgressTasks = computed(() => {
		return this.tasksSignal().filter((task) => task.status === 'PROGRESS');
	});
	reviewTasks = computed(() => {
		return this.tasksSignal().filter((task) => task.status === 'REVIEW');
	});
	doneTasks = computed(() => {
		return this.tasksSignal().filter((task) => task.status === 'DONE');
	});

	isModalOpen = signal(false);

    openCreateModal() {
        this.isModalOpen.set(true);
    }

    closeCreateModal() {
        this.isModalOpen.set(false);
    }

	selectedTask = signal<TaskSummary | true | null | Task>(null);

	// Update your modal triggers
	openEditModal(task: TaskSummary) {
		this.kanbanService.getTask(task.id, this.selectedTask)
	}

	openCreationModal(){
		this.selectedTask.set(true);
	}

	closeEditModal() {
		this.selectedTask.set(null);
	}

	onCardDropped(event: CdkDragDrop<any[]>) {
		const movedTask = event.previousContainer.data[event.previousIndex];
        const targetStatus = event.container.id as Task['status'];

		if (!movedTask) return;

		this.kanbanService.updateTask(
			movedTask.id, targetStatus, event.previousIndex, event.currentIndex, event.previousContainer.id === event.container.id
		)
  	}

	triggerDeleteTask(taskId: number){
		this.kanbanService.deleteTask(taskId);
	}
}
