import { InjectionToken } from '@angular/core';
import type { WorkflowStore } from '../services/workflow-store.interface';

export const WORKFLOW_STORE = new InjectionToken<WorkflowStore>('WORKFLOW_STORE');
