import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JsonPipe, NgIf } from '@angular/common';
import type { WorkflowNode } from '../../../../core/models/workflow.model';

@Component({
  selector: 'app-run-inspector',
  standalone: true,
  imports: [NgIf, JsonPipe],
  templateUrl: './run-inspector.component.html',
  styleUrl: './run-inspector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RunInspectorComponent {
  @Input() selectedNode: WorkflowNode | null = null;
}
