// biome-ignore lint/style/useImportType: Angular DI needs runtime references for these symbols.
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import type { CanvasNodeSpawn, Workflow } from '../../../../core/models/workflow.model';

@Component({
  selector: 'app-workflow-canvas',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './workflow-canvas.component.html',
  styleUrl: './workflow-canvas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowCanvasComponent {
  @Input() workflow: Workflow | null = null;
  @Input() selectedNodeId: string | null = null;

  @Output() nodeSpawn = new EventEmitter<CanvasNodeSpawn>();
  @Output() nodeSelected = new EventEmitter<string>();

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    const templateId =
      event.dataTransfer?.getData('application/x-flowforge-template') ??
      event.dataTransfer?.getData('text/plain');
    if (!templateId) {
      return;
    }

    const rect = this.host.nativeElement.getBoundingClientRect();
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    this.nodeSpawn.emit({ templateId, position });
  }

  trackNode(_: number, node: { id: string }): string {
    return node.id;
  }

  selectNode(nodeId: string): void {
    this.nodeSelected.emit(nodeId);
  }
}
