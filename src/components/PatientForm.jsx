// src/components/PatientForm.jsx
import React from 'react';
import { TextField, Grid, Card, CardContent, Typography } from '@mui/material';

const PatientForm = () => {
  return (
    // Adicionamos classes do Tailwind diretamente no componente Card do MUI
    <Card sx={{ mt: 2 }} className="shadow-xl">
      <CardContent className="bg-slate-50"> {/* Fundo cinza claro e sombra */}
        <Typography variant="h6" gutterBottom>
          Dados do Paciente
        </Typography>
        <Grid container spacing={2}>
          {/* ...o resto dos seus TextFields */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Nome do Paciente" variant="outlined" size="small" />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Data de Nascimento" variant="outlined" size="small" type="date" InputLabelProps={{ shrink: true }} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="CPF" variant="outlined" size="small" />
          </Grid>
          {/* ... */}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PatientForm;