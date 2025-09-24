import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box, Grid, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

// É necessário registar os componentes que o Chart.js vai usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const defaultAudiogramData = {
  od: {
    aerea: { 250: 10, 500: 15, 1000: 20, 2000: 25, 4000: 45, 8000: 50 },
    ossea: { 250: 5, 500: 10, 1000: 15, 2000: 20, 4000: 40, 8000: null },
  },
  oe: {
    aerea: { 250: 15, 500: 20, 1000: 25, 2000: 30, 4000: 55, 8000: 60 },
    ossea: { 250: 10, 500: 15, 1000: 20, 2000: 25, 4000: 50, 8000: null },
  }
};

const FREQUENCIES = [250, 500, 1000, 2000, 4000, 8000];

const createSymbol = (type, color) => {
  const symbol = document.createElement('canvas');
  const ctx = symbol.getContext('2d');
  symbol.width = 14;
  symbol.height = 14;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  switch (type) {
    case 'O':
      ctx.beginPath();
      ctx.arc(7, 7, 5, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    case 'X':
      ctx.beginPath();
      ctx.moveTo(2, 2);
      ctx.lineTo(12, 12);
      ctx.moveTo(12, 2);
      ctx.lineTo(2, 12);
      ctx.stroke();
      break;
    case '<':
      ctx.beginPath();
      ctx.moveTo(10, 2);
      ctx.lineTo(4, 7);
      ctx.lineTo(10, 12);
      ctx.stroke();
      break;
    case '>':
      ctx.beginPath();
      ctx.moveTo(4, 2);
      ctx.lineTo(10, 7);
      ctx.lineTo(4, 12);
      ctx.stroke();
      break;
    default:
      break;
  }
  return symbol;
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      reverse: true,
      min: -10,
      max: 120,
      ticks: {
        stepSize: 10,
      },
      title: {
        display: true,
        text: 'Intensidade (dBNA)',
      },
    },
    x: {
      title: {
        display: true,
        text: 'Frequência (Hz)',
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const DataTable = ({ earData }) => (
  <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Aérea</TableCell>
          {FREQUENCIES.map(freq => <TableCell key={freq} align="center">{earData.aerea[freq] ?? '-'}</TableCell>)}
        </TableRow>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Óssea</TableCell>
          {FREQUENCIES.map(freq => <TableCell key={freq} align="center">{earData.ossea[freq] ?? '-'}</TableCell>)}
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

const AudiogramChartJS = ({ audiogramData = defaultAudiogramData }) => {
  const odData = {
    labels: FREQUENCIES,
    datasets: [
      {
        label: 'OD Aérea',
        data: FREQUENCIES.map(f => audiogramData.od.aerea[f]),
        borderColor: 'red',
        backgroundColor: 'red',
        pointStyle: createSymbol('O', 'red'),
        tension: 0.1, // Linha contínua (padrão)
      },
      {
        label: 'OD Óssea',
        data: FREQUENCIES.map(f => audiogramData.od.ossea[f]),
        borderColor: 'red',
        backgroundColor: 'red',
        pointStyle: createSymbol('<', 'red'),
        // REMOVIDO: borderDash (para que não haja linha)
        // REMOVIDO: tension
        showLine: false, // <-- AQUI: Não mostra a linha para via óssea OD
      },
    ],
  };

  const oeData = {
    labels: FREQUENCIES,
    datasets: [
      {
        label: 'OE Aérea',
        data: FREQUENCIES.map(f => audiogramData.oe.aerea[f]),
        borderColor: 'blue',
        backgroundColor: 'blue',
        pointStyle: createSymbol('X', 'blue'),
        borderDash: [5, 5], 
        tension: 0.1,
      },
      {
        label: 'OE Óssea',
        data: FREQUENCIES.map(f => audiogramData.oe.ossea[f]),
        borderColor: 'blue',
        backgroundColor: 'blue',
        pointStyle: createSymbol('>', 'blue'),
        // REMOVIDO: borderDash
        // REMOVIDO: tension
        showLine: false, // <-- AQUI: Não mostra a linha para via óssea OE
      },
    ],
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, border: '1px solid #ddd' }}>
          <Typography variant="h6" align="center">Orelha Direita</Typography>
          <Box sx={{ height: '400px', mt: 1 }}>
            <Line options={chartOptions} data={odData} />
          </Box>
          <DataTable earData={audiogramData.od} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, border: '1px solid #ddd' }}>
          <Typography variant="h6" align="center">Orelha Esquerda</Typography>
          <Box sx={{ height: '400px', mt: 1 }}>
            <Line options={chartOptions} data={oeData} />
          </Box>
          <DataTable earData={audiogramData.oe} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AudiogramChartJS;