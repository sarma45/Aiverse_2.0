import { Queue } from 'bullmq';
import { redis } from '../redis';

export const workflowQueue = new Queue('workflow-execution', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  connection: redis as any,
});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addWorkflowJob(workflowId: string, input: any, userId: string) {
  return await workflowQueue.add('execute', {
    workflowId,
    input,
    userId,
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
}
