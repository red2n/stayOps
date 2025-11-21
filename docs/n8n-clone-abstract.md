# FlowForge: Abstract Documentation

## Vision
- Deliver an open workflow automation platform with the flexibility of n8n but streamlined for enterprise self‑hosting, long‑running jobs, and hybrid cloud execution.
- Treat every workflow as versioned infrastructure: reproducible, observable, secure by default.

## Core Use Cases
1. API orchestration and ETL across SaaS products.
2. Event-driven internal tooling (helpdesk, finance, ops automations).
3. Human-in-the-loop approval flows with pause/resume semantics.
4. ML operations glue code (data prep → scoring → alerting).

## Product Pillars
- **Composable Nodes:** Typed inputs/outputs, deterministic contracts, schema linting per port.
- **Execution Engine:** Horizontal scaling, resumable state, per-step retry + circuit breakers.
- **Observability:** Structured logs, span traces per workflow run, artefact capture for audit.
- **Governance:** Role-based projects, secret scopes, dependency provenance, signed workflows.
- **Extensibility:** Low-latency SDK for custom nodes, CLI scaffolding, template registry.

## High-Level Architecture
```
┌────────────┐     ┌─────────────┐     ┌─────────────┐
│ Frontend   │ <-- │ GraphQL API │ --> │ Event Bus   │
│ (Angular)  │     └─────────────┘     └─────────────┘
└─────▲──────┘             │                 │
      │                    ▼                 ▼
┌─────┴──────┐     ┌─────────────┐     ┌─────────────┐
│ Workflow   │ --> │ Workers     │ --> │ Connectors  │
│ Registry   │     │ (K8s/VMs)   │     │ (Node SDK)  │
└────────────┘     └─────────────┘     └─────────────┘
```

### Control Plane vs Data Plane
- **Control Plane (CP)**: Frontend, GraphQL API, Workflow Registry, and supporting databases live here. The CP handles configuration, versioning, RBAC, scheduling decisions, and monitoring surfaces. It is latency-sensitive but low-throughput compared to worker execution.
- **Data Plane (DP)**: Workers, connector runtimes, and event bus topics form the DP. They execute user automations, scale horizontally, and can be deployed close to user data or inside VPCs. DP communicates with CP only through signed job descriptors and telemetry throttled channels.

### Request Lifecycle Walkthrough
1. Builder updates a workflow in the **Frontend**; mutation is sent via **GraphQL API**.
2. API persists the draft/versioned DAG inside the **Workflow Registry** (Postgres + S3) and emits a "workflow.updated" event.
3. A trigger (cron, webhook, external bus) arrives at the **Event Bus**. The API transforms it into a `RunRequest`, signs it, and publishes to a worker queue.
4. **Workers** subscribe to run queues, fetch workflow definitions + secrets, and orchestrate node execution. They snapshot state back to the registry for resumability.
5. Node execution either uses bundled connectors (HTTP, DB, SaaS) or dynamically loads packages built with the **Connectors SDK**. Each node pushes logs/metrics traces which flow back to observability stacks.
6. Upon completion or failure, workers emit run-complete events → API updates run status → frontend reflects state and optionally fires callbacks/webhooks.

### Data Flows & Storage
- DAG definitions, node templates, and run metadata persist in the Workflow Registry (Postgres tables + artefacts bucket). Workers only cache them short-term.
- Secrets are fetched just-in-time from the control plane (Vault/KMS) and streamed to workers via mutually-authenticated channels.
- Logs/metrics/traces stream asynchronously from workers to observability sinks; user-facing dashboards pull aggregated data via the API.

### Deployment Topology
- CP typically runs in a hardened cluster (Kubernetes control namespace) with autoscaled API pods, registry DB, and cache layers.
- DP can run as a separate Kubernetes cluster, VM fleet, or hybrid arrangement (e.g., on-prem workers tethered to cloud CP) using gRPC tunnels + event streams.
- Event Bus (NATS/Redpanda) bridges CP and DP, enabling multi-region fan-out and replay. Durable storage ensures workflow triggers survive outages.

### Components
- **Frontend:** Angular + NgRx; visual canvas with node catalog search, execution timeline overlay.
- **GraphQL API:** Apollo Server w/ Prisma; handles workflow CRUD, scheduling, secrets, RBAC.
- **Workflow Registry:** Postgres + S3; stores DAG definitions, binaries, artefacts.
- **Execution Workers:** Node.js + Temporal or custom orchestrator; fetch jobs, manage retries, push traces.
- **Event Bus:** NATS or Kafka; decouples triggers, webhooks, task dispatch.
- **Connectors SDK:** TypeScript package exposing base node class, schema validation, secrets helper.

## Tech Stack & OSS Modules
- **Frontend**
  - Angular 18 + TypeScript + Angular CLI for the builder UI.
  - `@ngx-flowchart/ngx-flowchart` (or ngx-graph) for the canvas, NgRx SignalStore for state, Angular Material + TailwindCSS for styling.
- **API & Control Plane**
  - NestJS (GraphQL mode) with Apollo Server, Prisma ORM, PostgreSQL 15.
  - Redis for queues, caching, and distributed locks.
- **Workflow Execution**
  - Temporal OSS cluster orchestrating Node.js 20 workers.
  - BullMQ + Redis for lightweight triggers and schedules.
  - VM2 sandbox for custom JavaScript nodes; Docker sidecars for heavier jobs.
- **Data & Artefacts**
  - PostgreSQL for metadata, MinIO/S3 buckets for artefacts, ClickHouse for run analytics (optional).
  - Hashicorp Vault for secrets management.
- **Observability & Ops**
  - OpenTelemetry collectors shipping to Prometheus (metrics), Loki (logs), Tempo (traces), visualized in Grafana.
  - Helm chart managed via Argo CD for GitOps deployments.
- **Security & Developer Tooling**
  - Keycloak for SSO/RBAC, OPA for policy enforcement.
  - `flowforge` CLI on oclif, Nx for monorepo builds, Jest + MSW for SDK tests, Docusaurus for docs.

## Data Model (abridged)
- `Workspace` ↔ `Project` ↔ `Workflow` (versioned, immutable DAG definition).
- `Run` entity holds metadata, state snapshots, emitted events, artefact pointers.
- `Node Template` describes IO schema, auth requirements, default config UI form.
- `Secret` scoped to project; resolved at runtime via HashiCorp Vault or cloud KMS.

## Execution Lifecycle
1. Trigger received (webhook, schedule, event bus, manual).
2. GraphQL API enqueues job message with workflow version + input payload hash.
3. Worker pulls message, hydrates secrets, validates DAG, starts trace span.
4. Each node executes inside isolated sandbox (VM2 / containers); emits logs + metrics.
5. Failures roll back per node policy (retry, fallback, manual intervention).
6. Completion posts webhook/callback and archives artefacts.

## Security & Compliance
- Secrets never persist in worker disks; injected via short-lived tokens.
- OPA policies enforce who can publish/execute workflows.
- Audit log pipelines to SIEM; immutable storage w/ retention policy.
- Support for air-gapped deployments (artifact mirrors, offline license).

## Extensibility Strategy
- **Node Marketplace:** Signed bundles, semantic versioning, compatibility scorecard.
- **CLI Tooling:** `flowforge` CLI to init projects, test nodes locally, run e2e sims.
- **SDK Testing Harness:** Jest-based suite with mocked services, latency injection.

## Roadmap Snapshot
| Phase | Goal | Highlights |
|-------|------|------------|
| Alpha (0-3m) | Core workflow builder + executor | 20 core connectors, single-tenant ops |
| Beta (3-6m) | Multi-tenant SaaS + observability | Tracing UI, RBAC, template registry |
| GA (6-9m) | Enterprise readiness | Air-gap install, SSO, audit/compliance exports |

## Competitive Edge vs n8n
- Native Temporal-compatible executor → better long-running reliability.
- Opinionated governance / RBAC objects for large orgs out of the box.
- SDK-first marketplace with automated quality gates.
- Built-in ML/analytics-oriented nodes (vector DB, feature store, LLM tooling).

## Open Questions
- Should we embrace WASI sandboxes for node execution to unlock polyglot connectors?
- Do we standardize on GraphQL federation for multi-region control plane?
- How opinionated should secret management be (pluggable vs first-class Vault)?
