import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-builder-toolbar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './builder-toolbar.component.html',
  styleUrl: './builder-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuilderToolbarComponent {
  @Output() run = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  handleRun(): void {
    this.run.emit();
  }

  handleSave(): void {
    this.save.emit();
  }
}
