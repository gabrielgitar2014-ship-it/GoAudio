import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, Button, Grid, Divider, Tabs, Tab, TextField, Stack, CircularProgress 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import EventIcon from '@mui/icons-material/Event';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { MenuItem } from '@mui/material';
import { useData } from '../context/DataContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (<Box sx={{ p: 3 }}>{children}</Box>)}
    </div>
  );
}

const FuncionarioDetalhe = () => {
  const { id: funcionarioIdParam } = useParams();
  const navigate = useNavigate();
  // 1. OBTENHA A FUNÇÃO 'addEvolucao' DO NOSSO "CÉREBRO"
  const { funcionarios, empresas, evolucoes, loading, addEvolucao, addAgendamento, updateFuncionario } = useData();
  
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState(null);
  const [evolutionNote, setEvolutionNote] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleType, setScheduleType] = useState('Periódico');

  const funcionario = useMemo(() => {
    return funcionarios.find(f => f.id === parseInt(funcionarioIdParam));
  }, [funcionarios, funcionarioIdParam]);
  
  // Atualiza o formulário de edição quando o funcionário é carregado
  useEffect(() => {
    if (funcionario) {
      setFormData(funcionario);
    }
  }, [funcionario]);

  const evolutionHistory = useMemo(() => {
    return evolucoes.filter(e => e.funcionario_id === parseInt(funcionarioIdParam));
  }, [evolucoes, funcionarioIdParam]);

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleFormChange = (event) => setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));

  // --- FUNÇÕES DE SALVAR ---
  
  const handleSaveEdits = async () => {
    const { nome, cpf, data_nascimento, matricula, funcao } = formData;
    const updates = { nome, cpf, data_nascimento, matricula, funcao };
    const { error } = await updateFuncionario(funcionario.id, updates);
    if (error) { alert("Erro ao salvar as alterações."); } 
    else { alert("Funcionário atualizado com sucesso!"); }
  };

  // 2. ESTA É A FUNÇÃO QUE O BOTÃO DE EVOLUÇÃO CHAMA
  const handleAddEvolution = async () => {
    if (evolutionNote.trim() === '') {
      alert("Por favor, escreva uma nota de evolução.");
      return;
    }
    // Cria o objeto para ser inserido no Supabase
    const novaEvolucao = {
        funcionario_id: funcionario.id,
        nota: evolutionNote,
    };
    // Chama a função do DataContext para salvar no banco de dados
    const { error } = await addEvolucao(novaEvolucao);

    if (error) {
      alert("Erro ao adicionar evolução.");
    } else {
      // Limpa o campo de texto após o sucesso
      setEvolutionNote(''); 
    }
  };

  const handleScheduleExam = async () => {
    if (!scheduleDate) {
      alert("Por favor, selecione uma data.");
      return;
    }
    const novoAgendamento = {
        funcionario_id: funcionario.id,
        data_agendamento: scheduleDate,
        tipo_exame: scheduleType
    };
    const { error } = await addAgendamento(novoAgendamento);
    if (error) { alert("Erro ao agendar exame."); } 
    else {
      alert("Exame agendado com sucesso!");
      setScheduleDate('');
    }
  };

  if (loading) return <CircularProgress />;
  if (!funcionario) return <Typography variant="h5">Funcionário não encontrado.</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
            <Typography variant="h5">{funcionario.nome}</Typography>
            <Typography variant="body1" color="text.secondary">{empresas.find(e => e.id === funcionario.empresa_id)?.razao_social}</Typography>
        </Box>
        <Button onClick={() => navigate(-1)} variant="outlined" startIcon={<ArrowBackIcon />}>
          Voltar
        </Button>
      </Box>
      <Divider />

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Editar Funcionário" />
          <Tab label="Evolução" />
          <Tab label="Marcar Exame" />
        </Tabs>
      </Box>

      {/* Aba de Edição */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}><TextField name="nome" label="Nome Completo" value={formData?.nome || ''} onChange={handleFormChange} fullWidth /></Grid>
          <Grid item xs={12} sm={4}><TextField name="matricula" label="Nº Matrícula" value={formData?.matricula || ''} onChange={handleFormChange} fullWidth /></Grid>
          <Grid item xs={12} sm={4}><TextField name="funcao" label="Função / Cargo" value={formData?.funcao || ''} onChange={handleFormChange} fullWidth /></Grid>
          <Grid item xs={12} sm={4}><TextField name="cpf" label="CPF" value={formData?.cpf || ''} onChange={handleFormChange} fullWidth /></Grid>
          <Grid item xs={12} sm={4}><TextField name="data_nascimento" label="Data de Nascimento" value={formData?.data_nascimento || ''} onChange={handleFormChange} fullWidth type="date" InputLabelProps={{ shrink: true }} /></Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveEdits}>Salvar Alterações</Button>
        </Stack>
      </TabPanel>

      {/* Aba de Evolução */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>Nova Anotação de Evolução</Typography>
        <TextField label="Descreva a evolução do paciente aqui..." multiline rows={5} fullWidth value={evolutionNote} onChange={(e) => setEvolutionNote(e.target.value)} />
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          {/* 3. O BOTÃO CHAMA A FUNÇÃO handleAddEvolution */}
          <Button variant="contained" startIcon={<NoteAddIcon />} onClick={handleAddEvolution}>Adicionar Evolução</Button>
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>Histórico de Evolução</Typography>
        <Stack spacing={2}>
            {evolutionHistory.length > 0 ? evolutionHistory.map(item => (
                <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">{new Date(item.created_at).toLocaleDateString('pt-BR')}</Typography>
                    <Typography variant="body1" sx={{whiteSpace: 'pre-wrap'}}>{item.nota}</Typography>
                </Paper>
            )) : <Typography color="text.secondary">Nenhuma evolução registada.</Typography>}
        </Stack>
      </TabPanel>

      {/* Aba de Marcar Exame */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Agendar Novo Exame</Typography>
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField label="Data do Exame" fullWidth type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField label="Tipo de Exame" value={scheduleType} onChange={e => setScheduleType(e.target.value)} select fullWidth>
                    <MenuItem value="Admissional">Admissional</MenuItem>
                    <MenuItem value="Periódico">Periódico</MenuItem>
                    <MenuItem value="Demissional">Demissional</MenuItem>
                </TextField>
            </Grid>
        </Grid>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button variant="contained" startIcon={<EventIcon />} onClick={handleScheduleExam}>Agendar Exame</Button>
        </Stack>
      </TabPanel>
    </Paper>
  );
};

export default FuncionarioDetalhe;