import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const Chart = ({ type = 'line', data, width = '100%', height = 300 }) => {
  if (type === 'line') {
    return (
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ansiedade" stroke="#DC2626" />
          <Line type="monotone" dataKey="depressao" stroke="#F59E0B" />
          <Line type="monotone" dataKey="sono" stroke="#0284C7" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width={width} height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#0066CC" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return null;
};
