import { Task } from "@/app/pages/(home)/index.server";
import TaskDetail from "@/components/task-detail.component";
import TaskUpdate from "@/components/task-update.component";
import { Component, input, output, signal } from "@angular/core";

@Component({
	selector: 'task-sheet',
	standalone: true,
	imports: [TaskUpdate, TaskDetail],
	template: `
		<div class="flex flex-col gap-4 w-full">
			<div class="flex items-center justify-between gap-4">
				<h2 class="text-3xl font-bold">
					Task no - {{id()}}
				</h2>
				<button (click)="toggleEdit()" class="btn-primary bg-primary">
					{{ isEdit() ? 'View Details' : 'Edit Task' }}
				</button>
			</div>
			@if(isEdit()) {
				<task-update
					method="PUT"
					[id]="id()"
					[title]="title()"
					[status]="status()"
					[description]="description()"
					(close)="close.emit()"
				/>
			}
			@else{
				<task-detail
					[title]="title()"
					[status]="status()"
					[description]="description()"
					(close)="close.emit()"
				/>
			}

		</div>
	`
})
export default class TaskSheet {
	isEdit = signal<boolean>(false);

	toggleEdit() {
		this.isEdit.set(!this.isEdit());
	}
	
	id = input.required<number>();
	title = input.required<string>();
	description = input.required<string>();
	status = input.required<Task['status']>();
	close = output<void>();
}