
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './chart';

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  valueFormatter?: (value: number) => string;
  colors?: string[];
}

export const BarChart = ({
  data,
  index,
  categories,
  valueFormatter = (value) => `${value}`,
  colors = ["#2563eb"]
}: BarChartProps) => {
  return (
    <ChartContainer config={{}} className="w-full h-full">
      <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey={index} 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <Tooltip 
          formatter={(value: number) => [valueFormatter(value), categories[0]]}
          labelFormatter={(label) => `${label}`}
        />
        {categories.map((category, i) => (
          <Bar 
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]} 
            radius={[4, 4, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};
