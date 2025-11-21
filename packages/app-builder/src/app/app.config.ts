import { provideZoneChangeDetection, type ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { InMemoryWorkflowStoreService } from './core/services/in-memory-workflow-store.service';
import { WORKFLOW_STORE } from './core/tokens/workflow-store.token';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: WORKFLOW_STORE, useClass: InMemoryWorkflowStoreService }
  ]
};
