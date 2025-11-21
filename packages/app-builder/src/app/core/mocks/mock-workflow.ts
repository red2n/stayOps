import { nanoid } from 'nanoid';
import type { Workflow, WorkflowNodeTemplate } from '../models/workflow.model';

export const MOCK_WORKFLOW: Workflow = {
  id: '11111111-2222-3333-4444-555555555555',
  name: 'Sample Incident Triage',
  version: 1,
  metadata: {
    createdBy: 'FlowForge',
    lastUpdated: new Date().toISOString()
  },
  nodes: [
    {
      id: 'trigger-http',
      type: 'httpTrigger',
      label: 'Incoming Webhook',
      position: { x: 80, y: 120 },
      config: {
        method: 'POST',
        path: '/incident'
      }
    },
    {
      id: 'enrich-ticket',
      type: 'httpRequest',
      label: 'Enrich Ticket',
      position: { x: 360, y: 120 },
      config: {
        url: 'https://status.example.com/api/incidents',
        method: 'POST'
      }
    },
    {
      id: 'notify-slack',
      type: 'slack',
      label: 'Notify Slack',
      position: { x: 620, y: 260 },
      config: {
        channel: '#oncall',
        template: 'Incident {{id}} created'
      }
    }
  ],
  edges: [
    {
      id: nanoid(),
      source: 'trigger-http',
      target: 'enrich-ticket',
      label: 'On event'
    },
    {
      id: nanoid(),
      source: 'enrich-ticket',
      target: 'notify-slack',
      label: 'On success'
    }
  ]
};

export const NODE_TEMPLATES: WorkflowNodeTemplate[] = [
  {
    id: 'httpTrigger',
    label: 'HTTP Trigger',
    description: 'Kick off a workflow via signed HTTP request.',
    category: 'trigger',
    accent: '#f97316',
    icon: 'link'
  },
  {
    id: 'schedule',
    label: 'Scheduler',
    description: 'Run on a CRON or human friendly cadence.',
    category: 'trigger',
    accent: '#facc15',
    icon: 'schedule'
  },
  {
    id: 'httpRequest',
    label: 'HTTP Request',
    description: 'Call third-party APIs with retries.',
    category: 'action',
    accent: '#38bdf8',
    icon: 'cloud'
  },
  {
    id: 'slack',
    label: 'Slack Notify',
    description: 'Send formatted messages to Slack.',
    category: 'action',
    accent: '#a855f7',
    icon: 'chat'
  },
  {
    id: 'delay',
    label: 'Delay',
    description: 'Pause execution for a configurable duration.',
    category: 'utility',
    accent: '#34d399',
    icon: 'hourglass_full'
  }
];
