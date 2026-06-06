import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Tool from '@/lib/models/Tool';
import Agent from '@/lib/models/Agent';
import Prompt from '@/lib/models/Prompt';
import Dataset from '@/lib/models/Dataset';
import Transaction from '@/lib/models/Transaction';
import Analytics from '@/lib/models/Analytics';
import { getCurrentUser } from '@/lib/authUtils';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = await getCurrentUser();
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = decoded.id;

    // Fetch all assets created by user
    const [tools, agents, prompts, datasets] = await Promise.all([
      Tool.find({ author: userId }),
      Agent.find({ author: userId }),
      Prompt.find({ author: userId }),
      Dataset.find({ author: userId }),
    ]);

    const allAssetIds = [
      ...tools.map(t => t._id),
      ...agents.map(a => a._id),
      ...prompts.map(p => p._id),
      ...datasets.map(d => d._id),
    ];

    // Real-time Analytics Aggregation (Grouped by Day)
    // Query the Analytics collection for events on the user's assets over the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const AnalyticsModel = Analytics;

    const dailyStats = await AnalyticsModel.aggregate([
      {
        $match: {
          assetId: { $in: allAssetIds },
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          views: { $sum: { $cond: [{ $eq: ["$eventType", "view"] }, 1, 0] } },
          clicks: { $sum: { $cond: [{ $eq: ["$eventType", "click"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalViews = tools.reduce((acc, t) => acc + (t.views || 0), 0) + agents.reduce((acc, a) => acc + (a.views || 0), 0);
    const totalClicks = tools.reduce((acc, t) => acc + (t.clicks || 0), 0);
    const totalTools = tools.length + agents.length + prompts.length + datasets.length;
    
    // Map aggregated data into the revenueData structure for Recharts
    const revenueData = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
       const d = new Date(now);
       d.setDate(d.getDate() - i);
       const dateStr = d.toISOString().split('T')[0];
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
       const stat = dailyStats.find((s: any) => s._id === dateStr);

       revenueData.push({
         date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
         revenue: stat ? (stat.views * 10 + stat.clicks * 50) : 0 // Simulated revenue based on real engagement data
       });
    }

    return NextResponse.json({ 
      status: 'success', 
      data: { 
        stats: {
          totalViews,
          totalClicks,
          totalTools,
        },
        revenueData,
        tools // Sending tools so the dashboard can render the table
      } 
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
