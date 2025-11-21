import type { Workflow, WorkflowEdge, WorkflowNode } from '@flowforge/sdk';

export type { Workflow, WorkflowEdge, WorkflowNode };

export interface WorkflowNodeTemplate {
  id: string;
  label: string;
  description: string;
  category: 'trigger' | 'action' | 'utility';
  accent: string;
  icon: string;
  defaultConfig?: Record<string, unknown>;
}

export interface CanvasPosition {
  x: number;
  y: number;
}

export interface CanvasNodeSpawn {
  templateId: string;
  position: CanvasPosition;
}
