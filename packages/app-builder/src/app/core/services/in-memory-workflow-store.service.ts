import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid';
import { BehaviorSubject, map, type Observable } from 'rxjs';
import type {
  CanvasNodeSpawn,
  Workflow,
  WorkflowNode,
  WorkflowNodeTemplate
} from '../models/workflow.model';
import { NODE_TEMPLATES, MOCK_WORKFLOW } from '../mocks/mock-workflow';
import type { WorkflowStore } from './workflow-store.interface';

@Injectable()
export class InMemoryWorkflowStoreService implements WorkflowStore {
  private readonly workflowSubject = new BehaviorSubject<Workflow>(MOCK_WORKFLOW);
  private readonly selectedNodeId = new BehaviorSubject<string | null>(null);
  private readonly templatesSubject = new BehaviorSubject<WorkflowNodeTemplate[]>(NODE_TEMPLATES);

  readonly workflow$ = this.workflowSubject.asObservable();
  readonly selectedNode$: Observable<WorkflowNode | null> = this.selectedNodeId.pipe(
    map((nodeId) => {
      if (!nodeId) {
        return null;
      }
      return this.workflowSubject.value.nodes.find((node) => node.id === nodeId) ?? null;
    })
  );

  readonly nodeTemplates$ = this.templatesSubject.asObservable();

  selectNode(nodeId: string | null): void {
    this.selectedNodeId.next(nodeId);
  }

  spawnNode(spawn: CanvasNodeSpawn): void {
    const template = this.templatesSubject.value.find((t) => t.id === spawn.templateId);
    if (!template) {
      return;
    }
    const newNode: WorkflowNode = {
      id: nanoid(),
      type: template.id,
      label: template.label,
      position: { x: spawn.position.x, y: spawn.position.y },
      config: template.defaultConfig ?? {}
    };
    const nextWorkflow: Workflow = {
      ...this.workflowSubject.value,
      nodes: [...this.workflowSubject.value.nodes, newNode]
    };
    this.workflowSubject.next(nextWorkflow);
    this.selectedNodeId.next(newNode.id);
  }

  moveNode(nodeId: string, coordinates: { x: number; y: number }): void {
    const workflow = this.workflowSubject.value;
    const nodes = workflow.nodes.map((node) =>
      node.id === nodeId ? { ...node, position: { ...coordinates } } : node
    );
    this.workflowSubject.next({ ...workflow, nodes });
  }
}
