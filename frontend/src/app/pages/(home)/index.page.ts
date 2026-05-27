import { Component } from '@angular/core';
import {
	CdkDragDrop,
	CdkDropListGroup,
	CdkDrag,
	CdkDropList,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop';

interface Task {
  id: number;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './index.page.html',
})
export default class Home {
	
}
