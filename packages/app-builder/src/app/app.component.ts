import { Component } from '@angular/core';
import { WorkspaceShellComponent } from './features/workspace/components/workspace-shell/workspace-shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkspaceShellComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
