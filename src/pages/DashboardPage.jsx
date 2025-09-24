import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Paper, Grid, Typography, Box, List, ListItem, ListItemText, 
  ListItemIcon, Avatar, Divider, CircularProgress 
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useData } from '../context/DataContext'; // 1. Importe o nosso hook "cérebro"

// --- DADOS DE EXEMPLO (APENAS PARA O QUE AINDA NÃO TEMOS NO DB) ---
// No futuro, estes dados também virão do DataContext
const mockExames = [
  { id: 1, funcionarioId: 5, empresaId: 1, diasRestantes: 15 },
  { id: 2, funcionarioId: 4, empresaId: 3, diasRestantes: 22 },
  { id: 3, funcionarioId: 2, empresaId: 2, diasRestantes: 30 },
];
const mockAlteracoes = [
  { id: 1, funcionarioId: 6, empresaId: 2, detalhe: 'STS na orelha direita' },
  { id: 2, funcionarioId: 3, empresaId: 1, detalhe: 'Piora significativa em 4kHz' },
];
const mockExamesMensais = [
  { empresaId: 1, mes: 'Abr', exames: 12 }, { empresaId: 1, mes: 'Mai', exames: 19 }, { empresaId: 1, mes: 'Jun', exames: 3 }, { empresaId: 1, mes: 'Jul', exames: 5 }, { empresaId: 1, mes: 'Ago', exames: 2 }, { empresaId: 1, mes: 'Set', exames: 3 },
  { empresaId: 2, mes: 'Abr', exames: 8 }, { empresaId: 2, mes: 'Mai', exames: 11 }, { empresaId: 2, mes: 'Jun', exames: 5 }, { empresaId: 2, mes: 'Jul', exames: 8 }, { empresaId: 2, mes: 'Ago', exames: 4 }, { empresaId: 2, mes: 'Set', exames: 7 },
];

// Componente para os cartões de indicadores (KPIs)
const KpiCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', height: '100%' }}>
    <Avatar sx={{ bgcolor: color, width: 56, height: 56, mr: 2 }}>
      {icon}
    </Avatar>
    <Box>
      <Typography variant="h5" component="div">{value}</Typography>
      <Typography color="text.secondary">{title}</Typography>
    </Box>
  </Paper>
);

const DashboardPage = () => {
  const { companyId } = useParams();
  // 2. BUSQUE OS DADOS GLOBAIS DO NOSSO "CÉREBRO"
  const { empresas, funcionarios, loading } = useData();

  // 3. FILTRE OS DADOS ESPECÍFICOS PARA ESTA EMPRESA
  // useMemo otimiza a performance, recalculando apenas se os dados mudarem
  const dadosDaEmpresa = useMemo(() => {
    const id = parseInt(companyId);
    if (loading || isNaN(id)) {
      return null;
    }

    const empresaAtual = empresas.find(e => e.id === id);
    const funcionariosDaEmpresa = funcionarios.filter(f => f.empresa_id === id);
    // Por enquanto, continuamos a usar os dados mock para exames e alterações
    const proximosExames = mockExames.filter(e => e.empresaId === id);
    const alteracoes = mockAlteracoes.filter(a => a.empresaId === id);
    const examesMensais = mockExamesMensais.filter(em => em.empresaId === id);
    
    return {
      empresa: empresaAtual,
      funcionarios: funcionariosDaEmpresa,
      proximosExames,
      alteracoes,
      examesMensais,
    };
  }, [companyId, empresas, funcionarios, loading]);

  // 4. EXIBA UM INDICADOR DE CARREGAMENTO SE OS DADOS AINDA NÃO CHEGARAM
  if (loading || !dadosDaEmpresa) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
         {dadosDaEmpresa.empresa?.razao_social || 'Empresa não encontrada'}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {/* KPIs agora usam os dados filtrados */}
        <Grid item xs={12} md={4}>
          <KpiCard title="Funcionários Monitorados" value={dadosDaEmpresa.funcionarios.length} icon={<PeopleIcon />} color="success.main" />
        </Grid>
        <Grid item xs={12} md={4}>
          <KpiCard title="Próximos Exames (30 dias)" value={dadosDaEmpresa.proximosExames.length} icon={<EventIcon />} color="primary.main" />
        </Grid>
        <Grid item xs={12} md={4}>
          <KpiCard title="Alertas de Alteração" value={dadosDaEmpresa.alteracoes.length} icon={<WarningAmberIcon />} color="warning.main" />
        </Grid>

        {/* Listas agora usam os dados filtrados */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Próximos Exames Periódicos</Typography>
            <List>
              {dadosDaEmpresa.proximosExames.map(exame => {
                  const func = dadosDaEmpresa.funcionarios.find(f => f.id === exame.funcionarioId);
                  return (
                    <ListItem key={exame.id} disablePadding>
                      <ListItemIcon><EventIcon color="action" /></ListItemIcon>
                      <ListItemText 
                        primary={func?.nome || 'Funcionário não encontrado'} 
                        secondary={`Vencimento em ${exame.diasRestantes} dias`} 
                      />
                    </ListItem>
                  );
              })}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Funcionários com Alterações Recentes</Typography>
            <List>
              {dadosDaEmpresa.alteracoes.map(item => {
                const func = dadosDaEmpresa.funcionarios.find(f => f.id === item.funcionarioId);
                return (
                  <ListItem key={item.id} disablePadding>
                    <ListItemIcon><WarningAmberIcon color="warning" /></ListItemIcon>
                    <ListItemText primary={func?.nome || 'Funcionário não encontrado'} secondary={item.detalhe} />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* Gráfico agora usa os dados filtrados */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Evolução de Exames Mensais</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={dadosDaEmpresa.examesMensais} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="exames" stroke="#8884d8" name="Nº de Exames" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;