import { AppHeader } from "@/app/layouts/header.component";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
	standalone: true,
	selector: 'main-layout',
	imports: [AppHeader, RouterOutlet],
	template:`
		<app-header/>
		<router-outlet></router-outlet>
	`
})
export default class MainLayout {}