import { Task } from "@/app/pages/(home)/index.server";
import TaskCard from "@/components/task-card.component";
import { CdkDrag, CdkDropList, CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, input, output } from "@angular/core";

@Component({
	selector: 'task-container',
	standalone: true,
	imports: [CdkDropList, TaskCard, CdkDrag],
	host: {
        class: 'block h-full'
    },
	template: `
		<div class="flex flex-col gap-4">
			<h2>{{title()}}</h2>
			<div
				cdkDropList
				[id]="id()"
				[cdkDropListData]="tasks()"
				(cdkDropListDropped)="dropped.emit($any($event))"
				class="rounded-2xl flex flex-col gap-2 p-2"
			>
				@for (task of tasks(); track task.id) {
					<task-card cdkDrag [id]="task.id" [title]="task.title" [status]="task.status" [createdAt]="task.createdAt" [updatedAt]="task.updatedAt" />
				}
				@empty {
					<p class="p-deemphasize">No tasks to do</p>
				}
				@if (isAddTaskAllowed()) {
					<button class="bg-primary rounded-2xl border border-foreground">
						Add Task +
					</button>	
				}
			</div>
		</div>
	`
})
export default class TaskContainer {
	id = input.required<string>();
	title = input.required<string>();
	tasks = input.required<Task[]>();
	isAddTaskAllowed = input<boolean>();
	dropped = output<CdkDragDrop<Task[]>>();
}