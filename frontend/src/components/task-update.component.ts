import { Task } from "@/app/pages/(home)/index.server";
import { Component, input, output } from "@angular/core";

@Component({
	selector: "task-update",
	standalone: true,
	template: `
		<form class="flex flex-col gap-4 border-primary border p-4 rounded-2xl" 
			(submit)="handleSubmit($event)">
			<label for="title">Title: </label >
			<input type="text" id="title" name="title" required [value]="title() ?? ''" placeholder="Input the title..." />
			
			<label for="description" >Description: </label>
			<textarea id="description" name="description" required [value]="description() ?? ''" placeholder="Task description"></textarea>
			
			<button type="submit">Create</button>
			<button (click)="close.emit()">Cancel</button>
		</form>
			`

})
export default class TaskUpdate {
	method = input.required<"POST" | "PUT">();
	id = input<number>();
	title = input<string>();
	description = input<string>();
	status = input<Task['status']>();
	close = output<void>();

	async handleSubmit(event: Event) {
		event.preventDefault();

		const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

		const payload = {
			title: formData.get('title') as string,
			description: formData.get('description') as string,
			status: this.method() === 'POST' ? 'TODO' : this.status()
		}
		const url = this.method() === 'POST'
		? 'http://localhost:8080/api/tasks'
		: `http://localhost:8080/api/tasks/${this.id()}`;

		try {
            // 4. Send it safely as application/json
            const response = await fetch(url, {
                method: this.method(),
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('Task saved successfully!');
				window.location.reload()
                // Optional: add a window.location.reload() or close modal logic here to refresh your board
            }
			else {
        // 🚀 Handle HTTP error codes (like 400, 404, 500)
				const errorData = await response.text(); 
				console.error(`Backend returned status ${response.status}:`, errorData);
				alert(`Server Error (${response.status}): Look at your Spring Boot terminal console!`);
			}
        } catch (error) {
            console.error('Failed to submit form:', error);
        }

	}
}