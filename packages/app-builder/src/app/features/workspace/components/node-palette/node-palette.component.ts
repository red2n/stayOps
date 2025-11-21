import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import type { WorkflowNodeTemplate } from '../../../../core/models/workflow.model';

type PaletteGroup = {
  title: string;
  templates: WorkflowNodeTemplate[];
};

@Component({
  selector: 'app-node-palette',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './node-palette.component.html',
  styleUrl: './node-palette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodePaletteComponent {
  @Input() templates: WorkflowNodeTemplate[] | null = [];
  @Output() templatePicked = new EventEmitter<string>();

  get groups(): PaletteGroup[] {
    const all = this.templates ?? [];
    const categories: Record<string, WorkflowNodeTemplate[]> = {};
    for (const template of all) {
      categories[template.category] = categories[template.category] ?? [];
      categories[template.category].push(template);
    }
    return Object.entries(categories).map(([title, items]) => ({
      title: this.humanize(title),
      templates: items
    }));
  }

  handlePick(templateId: string): void {
    this.templatePicked.emit(templateId);
  }

  handleDragStart(event: DragEvent, templateId: string): void {
    event.dataTransfer?.setData('application/x-flowforge-template', templateId);
    event.dataTransfer?.setData('text/plain', templateId);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  private humanize(category: string): string {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
}
