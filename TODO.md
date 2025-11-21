# FlowForge TODO

## 0. Foundations
- [ ] Initialize Lerna + pnpm monorepo with packages: `app-builder`, `api`, `worker`, `packages/sdk`.
- [ ] Decide license, CONTRIBUTING, CODEOWNERS, and adopt conventional commits.
- [ ] Set up CI scaffolding (lint, type-check, unit tests) via GitHub Actions.

## 1. Builder UI (No Backend Yet)
- [ ] Spin up `app-builder` (Angular 18 + TypeScript + SCSS + TailwindCSS).
- [ ] Integrate an Angular-friendly diagram toolkit (ngx-flowchart / ngx-graph) for drag-and-drop canvas and node handles.
- [ ] Stub local state using Zustand: in-memory workflows, nodes, edges, run history.
- [ ] Add node palette, configuration drawer, and JSON view backed by mock data.
- [ ] Implement serialization/import/export to JSON files for early sharing.
- [ ] Ship Storybook (or Ladle) for isolated component development.

## 2. Faux Services for Demo Mode
- [ ] Create a mock API layer (msw or local worker) that persists data in IndexedDB.
- [ ] Implement simple eval engine (Web Worker) that executes basic nodes (delay, HTTP mock, variable set).
- [ ] Add run timeline visualization with fake logs/metrics.

## 3. Backend MVP
- [ ] Scaffold NestJS GraphQL API with Prisma + PostgreSQL schema foundations.
- [ ] Implement auth stubs (API keys) and map front-end mock calls to real endpoints.
- [ ] Add Redis-backed queue for run requests; connect simple worker (Node + BullMQ).

## 4. Workflow Engine Alpha
- [ ] Integrate Temporal for resilient execution paths.
- [ ] Build connector SDK skeleton, sample HTTP + Slack nodes.
- [ ] Capture telemetry (OpenTelemetry), surface in UI via mock dashboards.

## 5. Production Hardening
- [ ] Secrets via Vault, policy via OPA, multi-tenant RBAC.
- [ ] GitOps deploy story (Helm + Argo CD) and observability stack (Prom/Grafana/Loki/Tempo).
- [ ] Marketplace packaging pipeline and CLI tooling.
