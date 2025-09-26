import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Box, Typography, Button, CircularProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useData } from '../context/DataContext';

const GerenciarExames = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { exames, funcionarios, loading } = useData();

  // Prepara os dados para a tabela, filtrando por empresa e adicionando o nome do funcionário
  const tableRows = useMemo(() => {
    const id = parseInt(companyId);
    if (loading || isNaN(id)) return [];

    const funcionariosDaEmpresaIds = new Set(
      funcionarios.filter(f => f.empresa_id === id).map(f => f.id)
    );
    
    const funcionarioMap = new Map(funcionarios.map(f => [f.id, f]));

    return exames
      .filter(exame => funcionariosDaEmpresaIds.has(exame.funcionario_id))
      .map(exame => {
        const funcionario = funcionarioMap.get(exame.funcionario_id);
        return {
          id: exame.id,
          data_exame: new Date(exame.data_exame).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
          tipo: exame.tipo_exame,
          resultado: exame.resultado,
          funcionario_nome: funcionario?.nome || 'N/A',
          funcionario_matricula: funcionario?.matricula || 'N/A',
        };
      });
  }, [companyId, exames, funcionarios, loading]);

  const columns = [
    { field: 'data_exame', headerName: 'Data', width: 120 },
    { field: 'funcionario_matricula', headerName: 'Matrícula', width: 120 },
    { field: 'funcionario_nome', headerName: 'Funcionário', width: 250 },
    { field: 'tipo', headerName: 'Tipo de Exame', width: 150 },
    { field: 'resultado', headerName: 'Resultado', flex: 1 },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Gerenciamento de Exames
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Voltar ao Dashboard
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <DataGrid
          rows={tableRows}
          columns={columns}
          // Habilita a barra de ferramentas com filtros, pesquisa, etc.
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </Paper>
  );
};

export default GerenciarExames;
