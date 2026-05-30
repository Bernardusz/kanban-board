import { Task } from "@/app/pages/(home)/index.server";
import { Component, input, output } from "@angular/core";

@Component({
	selector: "task-detail",
	standalone: true,
	template: `
		<div class="flex flex-col gap-4 border-primary border p-4 rounded-2xl" >
			<h3 id="title">Title: {{ title() }}</h3>
			
			<p id="description">
				{{ description() }}
			</p>
			
			<p id="status">Status: {{ status() }}</p>

			<button (click)="close.emit()" >Close</button>
		</div>
			`
})
export default class TaskDetail {
	title = input.required<string>();
	description = input.required<string>();
	status = input.required<Task['status']>();
	close = output<void>();
}
