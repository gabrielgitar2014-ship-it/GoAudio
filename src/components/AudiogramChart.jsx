import React, { useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Label, ReferenceArea
} from 'recharts';
import { Typography, Box, Grid } from '@mui/material'; // Importado Grid

// --- Constantes para Melhor Organização ---
const COLORS = {
  rightEar: 'red',
  leftEar: 'blue',
};

const FREQUENCIES = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000];

// --- Estrutura de Dados de Exemplo (se nenhuma for passada) ---
const initialAudiogramData = [
  { freq: 250,  od_ac: 10, oe_ac: 15, od_bc: 5,  oe_bc: 10 },
  { freq: 500,  od_ac: 10, oe_ac: 20, od_bc: 10, oe_bc: 15 },
  { freq: 1000, od_ac: 25, oe_ac: 45, od_bc: 25, oe_bc: 40 },
  { freq: 2000, od_ac: 40, oe_ac: 60, od_bc: 35, oe_bc: 55 },
  { freq: 4000, od_ac: 55, oe_ac: 70, od_bc: 55, oe_bc: 65 },
  { freq: 8000, od_ac: 65, oe_ac: { value: 90, noResponse: true }, od_bc: null, oe_bc: null },
];


// --- Componente de Símbolo Customizado (Dot) ---
const CustomDot = (props) => {
  const { cx, cy, dataKey, payload } = props;
  const size = 10;
  const strokeWidth = 1.5;
  const dataValue = payload[dataKey];
  const noResponse = dataValue && typeof dataValue === 'object' && dataValue.noResponse;

  if (dataValue === null || dataValue === undefined) {
      return null;
  }

  const svgX = cx - size / 2;
  const svgY = cy - size / 2;
  const color = dataKey.includes('od') ? COLORS.rightEar : COLORS.leftEar;
  let symbol = null;

  switch (dataKey) {
    case 'od_ac':
      symbol = <circle cx="5" cy="5" r="4" stroke={color} fill="none" strokeWidth={strokeWidth} />;
      break;
    case 'oe_ac':
      symbol = <path d="M1 1L9 9M9 1L1 9" stroke={color} strokeWidth={strokeWidth} />;
      break;
    case 'od_bc':
      symbol = <path d="M8 1L2 5L8 9" stroke={color} fill="none" strokeWidth={strokeWidth} />;
      break;
    case 'oe_bc':
      symbol = <path d="M2 1L8 5L2 9" stroke={color} fill="none" strokeWidth={strokeWidth} />;
      break;
    default:
      return null;
  }

  return (
    <svg x={svgX} y={svgY} width={size} height={size + (noResponse ? 5 : 0)} viewBox={`0 0 10 ${10 + (noResponse ? 5 : 0)}`} fill="none" key={`${dataKey}-${cx}-${cy}`}>
      {symbol}
      {noResponse && (
        <path d="M5 10L3 12M5 10L7 12" stroke={color} strokeWidth={strokeWidth} />
      )}
    </svg>
  );
};


const AudiogramChart = ({ audiogramData = initialAudiogramData }) => {
  const getValue = useCallback((entry) => {
    if (entry === null || entry === undefined) return null;
    return typeof entry === 'object' && entry !== null && 'value' in entry ? entry.value : entry;
  }, []);

  // MUDANÇA PRINCIPAL: A função da legenda agora usa Grid do MUI
  const renderCustomLegend = useCallback((props) => {
    const { payload } = props;
    const legendItems = [
      { key: 'od_ac', name: 'OD Aérea' },
      { key: 'od_bc', name: 'OD Óssea' },
      { key: 'oe_ac', name: 'OE Aérea' },
      { key: 'oe_bc', name: 'OE Óssea' },
    ];

    return (
      <Box sx={{ mt: 2, p: 1 }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {legendItems.map((item) => {
            const color = item.key.includes('od') ? COLORS.rightEar : COLORS.leftEar;
            let symbolPath = null;
            switch (item.key) {
              case 'od_ac': symbolPath = <circle cx="5" cy="5" r="4" stroke={color} fill="none" strokeWidth={1.5} />; break;
              case 'oe_ac': symbolPath = <path d="M1 1L9 9M9 1L1 9" stroke={color} strokeWidth={1.5} />; break;
              case 'od_bc': symbolPath = <path d="M8 1L2 5L8 9" stroke={color} fill="none" strokeWidth={1.5} />; break;
              case 'oe_bc': symbolPath = <path d="M2 1L8 5L2 9" stroke={color} fill="none" strokeWidth={1.5} />; break;
              default: break;
            }
            return (
              <Grid item key={item.key} xs="auto">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 10 10" style={{ marginRight: 5 }}>
                    {symbolPath}
                  </svg>
                  <Typography variant="body2" style={{ color: color }}>
                    {item.name}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  }, []);

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Typography variant="h6" align="center" gutterBottom>Gráfico Audiométrico</Typography>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={audiogramData} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
          <ReferenceArea y1={-10} y2={25} fill="#e8f5e9" fillOpacity={0.4} label={{ value: "Normal", position: "insideTopRight", fill: "#388e3c" }} />
          <ReferenceArea y1={26} y2={40} fill="#fffde7" fillOpacity={0.4} label={{ value: "Leve", position: "insideTopRight", fill: "#fbc02d" }} />
          <ReferenceArea y1={41} y2={70} fill="#fff3e0" fillOpacity={0.4} label={{ value: "Moderada", position: "insideTopRight", fill: "#f57c00" }} />
          <ReferenceArea y1={71} y2={90} fill="#ffcdd2" fillOpacity={0.4} label={{ value: "Severa", position: "insideTopRight", fill: "#d32f2f" }} />
          <ReferenceArea y1={91} y2={120} fill="#e1e1e1" fillOpacity={0.4} label={{ value: "Profunda", position: "insideTopRight", fill: "#424242" }} />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="freq" type="category" ticks={FREQUENCIES} interval={0} domain={['dataMin', 'dataMax']} padding={{ left: 20, right: 20 }}>
            <Label value="Frequência (Hz)" offset={-15} position="insideBottom" />
          </XAxis>
          <YAxis reversed={true} domain={[-10, 120]} ticks={[-10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]} interval={0}>
            <Label value="Intensidade (dBNA)" angle={-90} offset={10} position="insideLeft" />
          </YAxis>
          <Tooltip
            formatter={(value, name, props) => {
              const dataValue = props.payload[props.dataKey];
              if (dataValue && typeof dataValue === 'object' && dataValue.noResponse) {
                return [`> ${getValue(dataValue)} dBNA (Sem Resposta)`, name];
              }
              return [`${getValue(dataValue)} dBNA`, name];
            }}
            labelFormatter={(label) => `${label} Hz`}
          />
          <Legend content={renderCustomLegend} wrapperStyle={{ position: 'relative', bottom: '10px' }}/>
          <Line dataKey={d => getValue(d.od_ac)} name="OD Aérea" stroke={COLORS.rightEar} strokeWidth={2} dot={<CustomDot dataKey="od_ac" />} connectNulls={false} />
          <Line dataKey={d => getValue(d.oe_ac)} name="OE Aérea" stroke={COLORS.leftEar} strokeWidth={2} dot={<CustomDot dataKey="oe_ac" />} connectNulls={false} />
          <Line dataKey={d => getValue(d.od_bc)} name="OD Óssea" stroke={COLORS.rightEar} strokeWidth={2} strokeDasharray="5 5" dot={<CustomDot dataKey="od_bc" />} connectNulls={false} />
          <Line dataKey={d => getValue(d.oe_bc)} name="OE Óssea" stroke={COLORS.leftEar} strokeWidth={2} strokeDasharray="5 5" dot={<CustomDot dataKey="oe_bc" />} connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default AudiogramChart;