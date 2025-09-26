import React from 'react';
// 1. Importe useNavigate em vez de Link
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Paper, Box, Button, Typography, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AudiogramChartJS from '../components/AudiogramChartJS';

const ChartPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 2. Inicialize o hook de navegação
  const rawAudiogramData = location.state?.data || [];

  const formatDataForChart = (data) => {
    if (!data || data.length === 0) return null;
    const formatted = {
      od: { aerea: {}, ossea: {} },
      oe: { aerea: {}, ossea: {} },
    };
    data.forEach(d => {
      formatted.od.aerea[d.freq] = d.od_ac;
      formatted.od.ossea[d.freq] = d.od_bc;
      formatted.oe.aerea[d.freq] = d.oe_ac;
      formatted.oe.ossea[d.freq] = d.oe_bc;
    });
    return formatted;
  };

  const audiogramData = formatDataForChart(rawAudiogramData);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Relatório Audiométrico</Typography>
          {/* 3. O botão agora usa onClick para voltar */}
          <Button 
            onClick={() => navigate(-1)} 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
          >
            Voltar
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {audiogramData ? (
          <AudiogramChartJS audiogramData={audiogramData} />
        ) : (
          <Typography align="center" sx={{ mt: 4 }}>
            Nenhum dado detalhado de audiograma foi encontrado para este exame.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ChartPage;