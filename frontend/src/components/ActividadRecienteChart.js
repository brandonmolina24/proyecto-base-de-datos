import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';

const ActividadRecienteChart = ({ data }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>Actividad Reciente</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="solicitudes" stroke="#8884d8" activeDot={{ r: 8 }} name="Solicitudes Creadas" />
          <Line type="monotone" dataKey="desembolsos" stroke="#82ca9d" name="Préstamos Desembolsados" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default ActividadRecienteChart;