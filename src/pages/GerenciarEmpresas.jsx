import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importe o useNavigate
import { Paper, Grid, TextField, Button, Typography, Box, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const initialRows = [
  { id: 1, razaoSocial: 'Indústria Metalúrgica Alfa Ltda.', cnpj: '12.345.678/0001-99', cidade: 'Recife' },
  { id: 2, razaoSocial: 'Tecidos Pernambucanos S.A.', cnpj: '98.765.432/0001-11', cidade: 'Jaboatão dos Guararapes' },
  { id: 3, razaoSocial: 'Construtora Rocha Forte', cnpj: '45.123.789/0001-55', cidade: 'Olinda' },
];

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'razaoSocial', headerName: 'Razão Social', width: 350 },
  { field: 'cnpj', headerName: 'CNPJ', width: 200 },
  { field: 'cidade', headerName: 'Cidade', width: 200 },
];

const GerenciarEmpresas = () => {
  const [rows, setRows] = useState(initialRows);
  const navigate = useNavigate(); // 2. Inicialize o hook de navegação

  const handleCancel = () => {
    navigate(-1); // 3. A função para voltar para a página anterior
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Cadastrar Nova Empresa
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField label="CNPJ" fullWidth margin="normal" />
            <TextField label="Razão Social" fullWidth margin="normal" />
            <TextField label="Nome Fantasia" fullWidth margin="normal" />
            <TextField label="Endereço" fullWidth margin="normal" />
            <TextField label="Cidade" fullWidth margin="normal" />
            <TextField label="Estado" fullWidth margin="normal" />
            
            {/* 4. Adicionados os dois botões (Salvar e Cancelar) */}
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                fullWidth
              >
                Voltar
              </Button>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                fullWidth
              >
                Salvar Empresa
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 2, height: '70vh' }}>
          <Typography variant="h6" gutterBottom>
            Empresas Cadastradas
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            checkboxSelection
            disableSelectionOnClick
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GerenciarEmpresas;