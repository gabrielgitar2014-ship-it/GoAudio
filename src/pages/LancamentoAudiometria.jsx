import React, { useState, useEffect, useMemo } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { 
  Paper, Typography, Box, Button, IconButton, TextField, CircularProgress 
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid } from '@mui/x-data-grid';
import AddchartIcon from '@mui/icons-material/Addchart';
import BarChartIcon from '@mui/icons-material/BarChart';
import AudiogramModal from '../components/AudiogramModal';
import { useData } from '../context/DataContext';

const LancamentoAudiometria = () => {
  const { companyId } = useParams();
  // Pega os dados e funções do nosso "cérebro"
  const { empresas, funcionarios, exames, loading, addExame } = useData();

  const [funcionario, setFuncionario] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtra os funcionários e exames de forma otimizada
  const { empresaAtual, funcionariosDaEmpresa, examesDoFuncionario } = useMemo(() => {
    const id = parseInt(companyId);
    if (isNaN(id) || loading) {
      return { empresaAtual: null, funcionariosDaEmpresa: [], examesDoFuncionario: [] };
    }
    const empresa = empresas.find(e => e.id === id);
    const funcionariosFiltrados = funcionarios.filter(f => f.empresa_id === id);
    const examesFiltrados = funcionario ? exames.filter(e => e.funcionario_id === funcionario.id) : [];
    
    return { 
      empresaAtual: empresa, 
      funcionariosDaEmpresa: funcionariosFiltrados,
      examesDoFuncionario: examesFiltrados
    };
  }, [companyId, funcionario, empresas, funcionarios, exames, loading]);
  
  const handleFuncionarioChange = (event, newValue) => {
    setFuncionario(newValue);
  };
  
  const handleSaveAudiogram = async (newData) => {
    if (!funcionario) return;
    const novoExame = {
      funcionario_id: funcionario.id,
      data_exame: new Date().toISOString().split('T')[0],
      tipo: 'Novo Exame',
      resultado: 'Aguardando parecer',
      audiogram_data: newData,
    };
    await addExame(novoExame);
  };
  
  const columns = [
    { field: 'data_exame', headerName: 'Data do Exame', width: 150 },
    { field: 'tipo', headerName: 'Tipo de Exame', width: 150 },
    { field: 'resultado', headerName: 'Resumo do Resultado', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params) => (
        <IconButton
          component={RouterLink}
          to={`/empresa/${companyId}/grafico`}
          state={{ data: params.row.audiogram_data }}
          color="primary"
          aria-label="Ver gráfico"
          disabled={!params.row.audiogram_data}
        >
          <BarChartIcon />
        </IconButton>
      ),
    },
  ];

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Seleção de Funcionário - {empresaAtual?.razao_social || ''}
        </Typography>
        <Autocomplete
          id="autocomplete-funcionario"
          options={funcionariosDaEmpresa}
          getOptionLabel={(option) => `${option.matricula} - ${option.nome}`}
          value={funcionario}
          onChange={handleFuncionarioChange}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label="Pesquisar Funcionário por Matrícula ou Nome" />}
        />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Histórico de Exames {funcionario ? `- ${funcionario.nome}` : ''}
            </Typography>
            <Button 
                variant="contained" 
                startIcon={<AddchartIcon />}
                disabled={!funcionario}
                onClick={() => setIsModalOpen(true)}
            >
                Lançar Novo Exame
            </Button>
        </Box>
        <Box sx={{ height: '55vh' }}>
          <DataGrid
            rows={examesDoFuncionario}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </Box>
      </Paper>
      
      <AudiogramModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAudiogram}
        savedData={[]} 
      />
    </Box>
  );
};

export default LancamentoAudiometria;
