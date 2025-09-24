import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, TextField, Button, Box, InputAdornment, Typography, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FuncionarioModal from '../components/FuncionarioModal';
import { useData } from '../context/DataContext'; // Importa o hook

const GerenciarFuncionarios = () => {
  const { companyId } = useParams();
  // Pega os dados e funções do nosso "cérebro"
  const { funcionarios, empresas, loading, addFuncionario } = useData();
  
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const filteredRows = useMemo(() => {
    const idNumerico = parseInt(companyId);
    if (isNaN(idNumerico)) return [];

    // Mapeia IDs de empresas para nomes para usar na tabela
    const companyMap = new Map(empresas.map(e => [e.id, e.razao_social]));

    let rows = funcionarios
      .filter(f => f.empresa_id === idNumerico)
      .map(f => ({ ...f, empresa: companyMap.get(f.empresa_id) || 'N/A' }));

    if (searchText.trim() !== '') {
      const lowerCaseQuery = searchText.toLowerCase();
      rows = rows.filter(row =>
        row.nome.toLowerCase().includes(lowerCaseQuery) ||
        (row.matricula && row.matricula.toLowerCase().includes(lowerCaseQuery))
      );
    }
    return rows;
  }, [searchText, companyId, funcionarios, empresas]);

  const handleRowClick = (params) => {
    navigate(`${params.row.id}`, { state: { funcionario: params.row } });
  };

  const handleSaveFuncionario = async (novoFuncionario) => {
    await addFuncionario({ ...novoFuncionario, empresa_id: parseInt(companyId) });
  };

  const columns = [
    { field: 'matricula', headerName: 'Matrícula', width: 120 },
    { field: 'nome', headerName: 'Nome Completo', width: 250 },
    { field: 'funcao', headerName: 'Função', width: 200 },
    { field: 'empresa', headerName: 'Empresa', flex: 1 },
  ];

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Paper sx={{ p: 2, height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <TextField
          variant="outlined" size="small" placeholder="Buscar por nome ou matrícula..."
          value={searchText} onChange={(e) => setSearchText(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>), }}
          sx={{ width: '40%' }}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>
          Adicionar Funcionário
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <DataGrid rows={filteredRows} columns={columns} onRowClick={handleRowClick} sx={{ cursor: 'pointer' }} />
      </Box>
      <FuncionarioModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveFuncionario} />
    </Paper>
  );
};

export default GerenciarFuncionarios;