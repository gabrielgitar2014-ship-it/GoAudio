import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Grid, Typography, Box, List, ListItem, ListItemText, 
  ListItemIcon, Avatar, Divider, CircularProgress,
  ToggleButtonGroup, ToggleButton, CardActionArea 
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HearingDisabledIcon from '@mui/icons-material/HearingDisabled';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useData } from '../context/DataContext';

// Componente para os cartões de indicadores (KPIs)
const KpiCard = ({ title, value, icon, color, onClick }) => (
  <Paper 
    component={onClick ? CardActionArea : Paper}
    onClick={onClick}
    sx={{ 
      p: 2, display: 'flex', alignItems: 'center', height: '100%', 
      borderRadius: 3, boxShadow: 3,
      ...(onClick && { '&:hover': { transform: 'scale(1.03)' } }),
      transition: 'transform 0.2s ease-in-out',
    }}
  >
    <Avatar sx={{ bgcolor: color, width: 56, height: 56, mr: 2 }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>{value}</Typography>
      <Typography color="text.secondary">{title}</Typography>
    </Box>
  </Paper>
);

const DashboardPage = () => {
  const { companyId } = useParams();
  // Busca os dados reais e já carregados do nosso "cérebro"
  const { clientes, funcionarios, exames, agendamentos, loading } = useData();
  const [periodo, setPeriodo] = useState('90d');
  const navigate = useNavigate();

  const handlePeriodoChange = (event, newPeriodo) => {
    if (newPeriodo !== null) {
      setPeriodo(newPeriodo);
    }
  };

  // Filtra e calcula os dados específicos para esta empresa
  const dadosDaEmpresa = useMemo(() => {
    const id = parseInt(companyId);
    if (loading || isNaN(id) || !clientes || !funcionarios || !exames || !agendamentos) {
      return null;
    }

    // AQUI ESTÁ A CORREÇÃO: Busca o cliente na tabela 'clientes' e acede à coluna 'nome'
    const empresaAtual = clientes.find(c => c.id === id);
    const funcionariosDaEmpresa = (funcionarios || []).filter(f => f.empresa_id === id);
    
    const hoje = new Date();
    const dataLimite = new Date();
    if (periodo === '30d') dataLimite.setDate(hoje.getDate() - 30);
    if (periodo === '90d') dataLimite.setDate(hoje.getDate() - 90);
    if (periodo === '1y') dataLimite.setFullYear(hoje.getFullYear() - 1);

    const examesDaEmpresa = (exames || []).filter(e => {
      const func = funcionarios.find(f => f.id === e.funcionario_id);
      return func?.empresa_id === id;
    });

    const examesNoPeriodo = (periodo === 'all')
      ? examesDaEmpresa
      : examesDaEmpresa.filter(e => new Date(e.data_exame) >= dataLimite);
    
    const keywordsAlteracao = ['alteração', 'perda auditiva', 'pair', 'neurossensorial', 'condutiva', 'mista', 'sugestivo'];
    const funcionariosComAlteracaoIds = new Set(
      examesNoPeriodo
        .filter(e => {
          if (!e.resultado) return false;
          const resultadoLowerCase = e.resultado.toLowerCase();
          return keywordsAlteracao.some(keyword => resultadoLowerCase.includes(keyword));
        })
        .map(e => e.funcionario_id)
    );
    
    const examesAgendados = (agendamentos || []).filter(agendamento => 
        funcionariosDaEmpresa.some(f => f.id === agendamento.funcionario_id)
    );

    const totalComAlteracao = funcionariosComAlteracaoIds.size;
    const totalFuncionarios = funcionariosDaEmpresa.length;
    const totalNormais = totalFuncionarios > totalComAlteracao ? totalFuncionarios - totalComAlteracao : 0;
    
    const pieData = [
        { name: 'Normais', value: totalNormais },
        { name: 'Com Alteração', value: totalComAlteracao },
    ];

    return {
      empresa: empresaAtual,
      funcionarios: funcionariosDaEmpresa,
      totalFuncionarios,
      totalExames: examesNoPeriodo.length,
      totalComAlteracao,
      examesAgendados,
      pieData,
    };
  }, [companyId, clientes, funcionarios, exames, agendamentos, loading, periodo]);

  if (loading || !dadosDaEmpresa) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const COLORS = ['#4caf50', '#d32f2f'];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {/* AQUI ESTÁ A CORREÇÃO: Usa 'dadosDaEmpresa.empresa?.nome' */}
            Dashboard: {dadosDaEmpresa.empresa?.nome || 'Empresa não encontrada'}
          </Typography>
          <Typography color="text.secondary">
            Visão geral da saúde auditiva da empresa.
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={periodo}
          exclusive
          onChange={handlePeriodoChange}
          aria-label="filtro de período"
        >
          <ToggleButton value="30d">30d</ToggleButton>
          <ToggleButton value="90d">90d</ToggleButton>
          <ToggleButton value="1y">1 Ano</ToggleButton>
          <ToggleButton value="all">Tudo</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <KpiCard title="Funcionários Monitorados" value={dadosDaEmpresa.totalFuncionarios} icon={<PeopleIcon />} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard title="Com Alterações (no período)" value={dadosDaEmpresa.totalComAlteracao} icon={<HearingDisabledIcon />} color="#d32f2f" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard 
            title="Exames Realizados (no período)" 
            value={dadosDaEmpresa.totalExames} 
            icon={<AssessmentIcon />} 
            color="#1976d2"
            onClick={() => navigate(`/empresa/${companyId}/exames`)}
          />
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, height: '100%', borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>Próximos Exames Agendados</Typography>
            {dadosDaEmpresa.examesAgendados.length > 0 ? (
                <List>
                {dadosDaEmpresa.examesAgendados.map(agendamento => {
                    const func = dadosDaEmpresa.funcionarios.find(f => f.id === agendamento.funcionario_id);
                    return (
                        <ListItem key={agendamento.id} disablePadding>
                        <ListItemIcon><EventAvailableIcon color="action" /></ListItemIcon>
                        <ListItemText 
                            primary={func?.nome || 'Funcionário não encontrado'} 
                            secondary={`Agendado para: ${new Date(agendamento.data_agendamento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}`}
                        />
                        </ListItem>
                    );
                })}
                </List>
            ) : (
                <Typography sx={{ p: 2, color: 'text.secondary' }}>Nenhum exame agendado.</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
           <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3, boxShadow: 3 }}>
              <Typography variant="h6" gutterBottom>Distribuição de Status</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={dadosDaEmpresa.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {dadosDaEmpresa.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;