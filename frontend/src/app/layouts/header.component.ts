import { Component } from "@angular/core";

@Component({
	standalone: true,
	selector: 'app-header',
	template:`
		<header class="flex flex-col justify-between align-middle p-4 text-primary">
			<h1>Kanban Board</h1>
		</header>
	`
})
export class AppHeader {}