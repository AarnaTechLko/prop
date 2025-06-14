// components/LeadStatusPie.tsx
'use client'

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'New', value: 33 },
  { name: 'Active', value: 33 },
  { name: 'Follow Up', value: 33 },
];

const COLORS = ['#f97316', '#facc15', '#fcd34d']; // orange, yellow tones

export default function LeadStatusPie() {
  return (
    <div className="text-xs">
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
