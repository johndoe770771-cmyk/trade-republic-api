'use client';

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { generateAllocationData } from '@/lib/trade-republic';

export function AllocationChart() {
  const data = generateAllocationData([]);
  
  return (
    <div className="rounded-lg border border-border p-6 bg-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Asset Allocation</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name} ${value}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
