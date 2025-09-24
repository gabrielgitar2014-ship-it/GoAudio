import React, { useState } from 'react';
// 1. Importe useNavigate em vez de Link
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, Button, Grid, Divider, Tabs, Tab, TextField, Stack 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import EventIcon from '@mui/icons-material/Event';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { MenuItem } from '@mui/material';

// ... (O código dos componentes TabPanel e mockEvolucao continua igual)
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
const mockEvolucao = [
    { id: 1, data: '2025-08-21', nota: 'Paciente relata zumbido ocasional após jornada de trabalho. O exame audiométrico apresentou limiares dentro da normalidade.' },
    { id: 2, data: '2025-02-11', nota: 'Exame admissional. Nenhuma queixa auditiva reportada. Linha de base estabelecida.' },
];


const FuncionarioDetalhe = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 2. Inicialize o hook de navegação
  const [funcionario, setFuncionario] = useState(location.state?.funcionario);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState(location.state?.funcionario);
  const [evolutionNote, setEvolutionNote] = useState('');
  const [evolutionHistory, setEvolutionHistory] = useState(mockEvolucao);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleAddEvolution = () => {
    if (evolutionNote.trim() === '') return;
    const newNote = {
      id: evolutionHistory.length + 1,
      data: new Date().toISOString().split('T')[0],
      nota: evolutionNote,
    };
    setEvolutionHistory([newNote, ...evolutionHistory]);
    setEvolutionNote('');
  };

  if (!funcionario) {
    // ... (código para funcionário não encontrado continua igual)
    return <Paper sx={{p:3}}><Typography>Funcionário não encontrado.</Typography></Paper>
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
            <Typography variant="h5">{funcionario.nome}</Typography>
            <Typography variant="body1" color="text.secondary">{funcionario.empresa}</Typography>
        </Box>
        {/* 3. O botão agora usa onClick para voltar */}
        <Button 
            onClick={() => navigate(-1)} 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
        >
          Voltar para Lista
        </Button>
      </Box>
      <Divider />
      
      {/* O resto do componente (Tabs, TabPanel, etc.) continua exatamente igual */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="menu de detalhes do funcionário">
          <Tab label="Editar Funcionário" id="tab-0" />
          <Tab label="Evolução" id="tab-1" />
          <Tab label="Marcar Exame" id="tab-2" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><TextField name="nome" label="Nome Completo" value={formData.nome} onChange={handleFormChange} fullWidth /></Grid>
          <Grid item xs={12} sm={6}><TextField name="empresa" label="Empresa" value={formData.empresa} onChange={handleFormChange} fullWidth InputProps={{ readOnly: true }} /></Grid>
          <Grid item xs={12} sm={4}><TextField name="matricula" label="Nº Matrícula" value={formData.matricula} onChange={handleFormChange} fullWidth /></Grid>
          <Grid item xs={12} sm={4}><TextField name="funcao" label="Função / Cargo" value={formData.funcao} onChange={handleFormChange} fullWidth /></Grid>
          <Grid item xs={12} sm={4}><TextField name="cpf" label="CPF" value={formData.cpf} onChange={handleFormChange} fullWidth /></Grid>
          <Grid item xs={12} sm={4}><TextField name="dataNasc" label="Data de Nascimento" value={formData.dataNasc} onChange={handleFormChange} fullWidth type="date" InputLabelProps={{ shrink: true }} /></Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button variant="contained" startIcon={<SaveIcon />}>Salvar Alterações</Button>
        </Stack>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>Nova Anotação de Evolução</Typography>
        <TextField label="Descreva a evolução do paciente aqui..." multiline rows={5} fullWidth value={evolutionNote} onChange={(e) => setEvolutionNote(e.target.value)} />
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}><Button variant="contained" startIcon={<NoteAddIcon />} onClick={handleAddEvolution}>Adicionar Evolução</Button></Stack>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>Histórico de Evolução</Typography>
        <Stack spacing={2}>{evolutionHistory.map(item => (<Paper key={item.id} variant="outlined" sx={{ p: 2 }}><Typography variant="body2" color="text.secondary">{item.data}</Typography><Typography variant="body1">{item.nota}</Typography></Paper>))}</Stack>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Agendar Novo Exame</Typography>
        <Grid container spacing={2}><Grid item xs={12} sm={6}><TextField label="Data do Exame" fullWidth type="date" InputLabelProps={{ shrink: true }} /></Grid><Grid item xs={12} sm={6}><TextField label="Tipo de Exame" defaultValue="Periódico" select fullWidth><MenuItem value="Admissional">Admissional</MenuItem><MenuItem value="Periódico">Periódico</MenuItem><MenuItem value="Demissional">Demissional</MenuItem><MenuItem value="Mudança de Risco">Mudança de Risco</MenuItem><MenuItem value="Retorno ao Trabalho">Retorno ao Trabalho</MenuItem></TextField></Grid></Grid>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}><Button variant="contained" startIcon={<EventIcon />}>Agendar Exame</Button></Stack>
      </TabPanel>
    </Paper>
  );
};
export default FuncionarioDetalhe;