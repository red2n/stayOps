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
│ (React)    │     └─────────────┘     └─────────────┘
└─────▲──────┘             │                 │
      │                    ▼                 ▼
┌─────┴──────┐     ┌─────────────┐     ┌─────────────┐
│ Workflow   │ --> │ Workers     │ --> │ Connectors  │
│ Registry   │     │ (K8s/VMs)   │     │ (Node SDK)  │
└────────────┘     └─────────────┘     └─────────────┘
```

### Components
- **Frontend:** React + Zustand; visual canvas with node catalog search, execution timeline overlay.
- **GraphQL API:** Apollo Server w/ Prisma; handles workflow CRUD, scheduling, secrets, RBAC.
- **Workflow Registry:** Postgres + S3; stores DAG definitions, binaries, artefacts.
- **Execution Workers:** Node.js + Temporal or custom orchestrator; fetch jobs, manage retries, push traces.
- **Event Bus:** NATS or Kafka; decouples triggers, webhooks, task dispatch.
- **Connectors SDK:** TypeScript package exposing base node class, schema validation, secrets helper.

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

