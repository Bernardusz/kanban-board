import { Task, TaskSummary } from "@/app/pages/(home)/index.server";
import { Component, input, output } from "@angular/core";

@Component({
	selector: 'task-card',
	standalone: true,
	imports: [],
	host: {
        class: 'block w-full cursor-grab active:cursor-grabbing'
    },
	template: `
		<div class="flex flex-col gap-2 border border-foreground-tertiary p-4 border-l-4 border-l-primary active:cursor-grabbing">
			<div class="flex justify-between">
				<button (click)="editTask.emit({ id: id(), title: title(), description: description(), status: status(), createdAt: createdAt(), updatedAt: updatedAt() })">
					<h3>{{ title() }}</h3>
				</button>
				<button (click)="deleteTask.emit(id())" class="btn-primary rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700">Delete</button>
			</div>	
		
			<p class="p-deemphasize">Status: {{ status() }}</p>
			<div class="flex justify-between">
				<p class="p-deemphasize">Created at: {{ createdAt() }}</p>
				<p class="p-deemphasize">Updated at: {{ updatedAt() }}</p>
			</div>
		</div>
	`
})
export default class TaskCard {
	id = input.required<number>();
	title = input.required<string>();
	status = input.required<Task['status']>();
	description = input.required<string>();

	createdAt = input.required<string>();
	updatedAt = input.required<string>();
	
	deleteTask = output<number>();
	editTask = output<Task>();
}