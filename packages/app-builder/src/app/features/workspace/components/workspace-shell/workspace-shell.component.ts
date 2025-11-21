import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { WORKFLOW_STORE } from '../../../../core/tokens/workflow-store.token';
import type { WorkflowStore } from '../../../../core/services/workflow-store.interface';
import type { CanvasNodeSpawn } from '../../../../core/models/workflow.model';
import { BuilderToolbarComponent } from '../builder-toolbar/builder-toolbar.component';
import { NodePaletteComponent } from '../node-palette/node-palette.component';
import { WorkflowCanvasComponent } from '../workflow-canvas/workflow-canvas.component';
import { RunInspectorComponent } from '../run-inspector/run-inspector.component';

@Component({
  selector: 'app-workspace-shell',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    BuilderToolbarComponent,
    NodePaletteComponent,
    WorkflowCanvasComponent,
    RunInspectorComponent
  ],
  templateUrl: './workspace-shell.component.html',
  styleUrl: './workspace-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkspaceShellComponent {
  private readonly store: WorkflowStore = inject(WORKFLOW_STORE);

  readonly vm$ = combineLatest({
    workflow: this.store.workflow$,
    selectedNode: this.store.selectedNode$,
    templates: this.store.nodeTemplates$
  });

  handleTemplatePicked(templateId: string): void {
    const jitter = Math.floor(Math.random() * 120);
    this.store.spawnNode({ templateId, position: { x: 120 + jitter, y: 160 + jitter } });
  }

  handleNodeSpawn(spawn: CanvasNodeSpawn): void {
    this.store.spawnNode(spawn);
  }

  handleNodeSelected(nodeId: string): void {
    this.store.selectNode(nodeId);
  }

  handleSave(): void {
    console.info('Save triggered (mock)');
  }

  handleRun(): void {
    console.info('Run triggered (mock)');
  }
}
