import { z } from "zod";

export const WorkflowNodeSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  label: z.string().min(1),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  config: z.record(z.any()).default({})
});

export const WorkflowEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  label: z.string().optional(),
  condition: z.record(z.any()).optional()
});

export const WorkflowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3),
  version: z.number().int().nonnegative().default(1),
  nodes: z.array(WorkflowNodeSchema),
  edges: z.array(WorkflowEdgeSchema),
  metadata: z.record(z.any()).optional()
});

export type Workflow = z.infer<typeof WorkflowSchema>;
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>;

export const parseWorkflow = (candidate: unknown): Workflow =>
  WorkflowSchema.parse(candidate);
