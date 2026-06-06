'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DataPoint {
  date: string;
  revenue: number;
}

export default function RevenueChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="w-full h-[300px] glass-morphism p-6 rounded-3xl">
      <h3 className="text-lg font-bold mb-6 opacity-60 uppercase tracking-widest">Revenue Growth</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#ffffff40" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#ffffff40" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '12px' }}
            itemStyle={{ color: '#6366f1' }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#6366f1" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRev)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
