import { Worker } from 'bullmq';
import { redis } from '../redis';
import dbConnect from '../db';
import Workflow from '../models/Workflow';
import Agent from '../models/Agent';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanitizePrompt } from '../utils/security';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const setupWorkflowWorker = () => {
  const worker = new Worker('workflow-execution', async (job) => {
    const { workflowId, input } = job.data;
    await dbConnect();

    const workflow = await Workflow.findById(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    let currentOutput = input || "";
    const results = [];

    for (const step of workflow.steps) {
      let stepResult = "";
      const sanitizedInput = sanitizePrompt(currentOutput);

      if (step.type === 'prompt') {
        const prompt = `${step.config.prompt}\n\nInput: ${sanitizedInput}`;
        const genRes = await model.generateContent(prompt);
        stepResult = (await genRes.response).text();
      } else if (step.type === 'agent') {
        const agent = await Agent.findById(step.config.agentId);
        if (agent) {
          const prompt = `${agent.systemInstruction}\n\nTask: ${sanitizedInput}`;
          const genRes = await model.generateContent(prompt);
          stepResult = (await genRes.response).text();
        }
      }

      currentOutput = stepResult;
      results.push({ stepId: step.id, label: step.label, output: stepResult });
      
      // Update job progress
      await job.updateProgress((results.length / workflow.steps.length) * 100);
    }

    await Workflow.findByIdAndUpdate(workflow._id, { $inc: { usageCount: 1 } });

    return {
      finalOutput: currentOutput,
      stepResults: results,
    };
  }, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    connection: redis as any,
  });

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed!`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed: ${err.message}`);
  });

  return worker;
};
