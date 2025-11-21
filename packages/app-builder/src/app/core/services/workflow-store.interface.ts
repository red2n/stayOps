import type { Observable } from 'rxjs';
import type {
  CanvasNodeSpawn,
  Workflow,
  WorkflowNode,
  WorkflowNodeTemplate
} from '../models/workflow.model';

export interface WorkflowStore {
  readonly workflow$: Observable<Workflow>;
  readonly selectedNode$: Observable<WorkflowNode | null>;
  readonly nodeTemplates$: Observable<WorkflowNodeTemplate[]>;

  selectNode(nodeId: string | null): void;
  spawnNode(spawn: CanvasNodeSpawn): void;
  moveNode(nodeId: string, coordinates: { x: number; y: number }): void;
}
