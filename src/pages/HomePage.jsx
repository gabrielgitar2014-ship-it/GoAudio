// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import PatientForm from '../components/PatientForm';
import ResultsPanel from '../components/ResultsPanel';

const HomePage = () => {
  const [audiogramData, setAudiogramData] = useState([]);

  // Esta função será passada para o ResultsPanel
  const handleDataChange = (newData) => {
    setAudiogramData(newData);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PatientForm />

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          {/* O ResultsPanel agora ocupa a largura total */}
          <ResultsPanel onAudiogramDataChange={handleDataChange} />
        </Grid>
      </Grid>
      
      <Paper sx={{ p: 2, mt: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>Visualização do Gráfico</Typography>
        {/* Este é o botão que levará para a nova página */}
        <Link to="/grafico" state={{ data: audiogramData }}>
          <Button 
            variant="contained" 
            color="primary"
            disabled={audiogramData.length === 0} // Desabilita se não houver dados
          >
            Ver Gráfico em Tela Cheia
          </Button>
        </Link>
        {audiogramData.length === 0 && (
          <Typography variant="body2" color="textSecondary" sx={{mt: 1}}>
            Preencha os dados e clique em "Gerar Gráfico" no painel acima para habilitar a visualização.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

// Precisamos importar o Grid para o layout
import { Grid } from '@mui/material';

export default HomePage;