import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '00:00', uv: 4000, pv: 2400, amt: 2400 },
  { name: '04:00', uv: 3000, pv: 1398, amt: 2210 },
  { name: '08:00', uv: 2000, pv: 9800, amt: 2290 },
  { name: '12:00', uv: 2780, pv: 3908, amt: 2000 },
  { name: '16:00', uv: 1890, pv: 4800, amt: 2181 },
  { name: '20:00', uv: 2390, pv: 3800, amt: 2500 },
  { name: '24:00', uv: 3490, pv: 4300, amt: 2100 },
];

export const NeonChart: React.FC = () => {
  return (
    <div className="w-full h-64 font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#555" strokeOpacity={0.2} />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', color: '#fff' }}
            itemStyle={{ color: '#00f3ff' }}
          />
          <Area type="monotone" dataKey="uv" stroke="#00f3ff" fillOpacity={1} fill="url(#colorUv)" />
          <Area type="monotone" dataKey="pv" stroke="#bc13fe" fillOpacity={1} fill="url(#colorPv)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};