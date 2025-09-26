import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Grid, Card, CardActionArea, CardContent, 
  Box, AppBar, Toolbar, Button, CircularProgress, Paper
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import CadastrarEmpresaModal from '../components/CadastrarEmpresaModal';
// Removido o useData, pois vamos buscar os dados diretamente aqui
// import { useData } from '../context/DataContext'; 
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient'; // Adicionado import do supabase client

const CompanySelectionPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  // Adicionados estados locais para controlar os dados, loading e erros
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para buscar os dados usando a RPC que criamos
  const fetchEmpresas = async () => {
    setLoading(true);
    setError('');

    // Alterado: Chama a função RPC 'get_empresas_do_cliente'
    const { data, error: rpcError } = await supabase.rpc('get_empresas_do_cliente');

    if (rpcError) {
      console.error('Erro ao buscar empresas:', rpcError);
      setError('Não foi possível carregar as empresas.');
      setEmpresas([]);
    } else {
      setEmpresas(data || []);
    }
    setLoading(false);
  };

  // useEffect para buscar os dados quando o componente é montado
  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleSelectCompany = (companyId) => {
    // A navegação para a empresa selecionada continua a mesma
    navigate(`/empresa/${companyId}/dashboard`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Função para ser chamada quando uma nova empresa é salva com sucesso no modal
  const handleEmpresaSalva = () => {
      // Alterado: Chama a nossa nova função local para re-buscar os dados
      fetchEmpresas();
      console.log("Nova empresa salva, a lista será atualizada.");
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
        <AppBar position="static" elevation={1} color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AudioFacility - Painel do Fonoaudiólogo
            </Typography>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Sair
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 5, mb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Minhas Empresas Gerenciadas
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Selecione uma empresa para ver o dashboard ou cadastre uma nova utilizando uma vaga da sua licença.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setIsModalOpen(true)}
            >
              Cadastrar Nova Empresa
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
          ) : error ? ( // Adicionado: Exibição de mensagem de erro
            <Paper sx={{p: 4, textAlign: 'center', width: '100%', borderRadius: 3, backgroundColor: '#ffebee'}}>
                <Typography color="error">{error}</Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {/* Alterado: Mapeia diretamente o estado 'empresas' */}
              {empresas.map((company) => (
                <Grid item xs={12} sm={6} md={4} key={company.id}>
                  <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3, transition: '0.3s', '&:hover': { transform: 'scale(1.03)' } }}>
                    <CardActionArea onClick={() => handleSelectCompany(company.id)} sx={{ flexGrow: 1, p: 2 }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <BusinessIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: '600' }}>
                          {/* Alterado: Usa 'razao_social' da tabela 'empresas' */}
                          {company.razao_social}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {company.cidade}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          { !loading && empresas.length === 0 && !error && (
             <Paper sx={{p: 4, textAlign: 'center', width: '100%', borderRadius: 3}}>
                <Typography color="text.secondary">Nenhuma empresa cadastrada ainda. Clique no botão acima para adicionar a sua primeira empresa.</Typography>
             </Paper>
          )}
        </Container>
      </Box>

      {/* O modal que lida com o fluxo de "usar uma vaga" para cadastrar a empresa */}
      {/* Usando a versão correta e simplificada do CadastrarEmpresaModal */}
      <CadastrarEmpresaModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleEmpresaSalva}
      />
    </>
  );
};

export default CompanySelectionPage;
