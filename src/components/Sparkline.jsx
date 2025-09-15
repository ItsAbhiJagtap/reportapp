import React from 'react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

const Sparkline = ({ data, color = '#3B82F6', height = 24 }) => {
  return (
    <div style={{ width: 80, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, bottom: 0, left: 2 }}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Sparkline;


