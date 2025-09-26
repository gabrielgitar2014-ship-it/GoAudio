import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Grid, Card, CardActionArea, CardContent, 
  Box, AppBar, Toolbar, Button, CircularProgress, Paper
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import CadastrarEmpresaModal from '../components/CadastrarEmpresaModal'; // Importa o novo modal
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const CompanySelectionPage = () => {
  const navigate = useNavigate();
  // Obtém os dados e o estado de carregamento do nosso "cérebro" de dados
  const { clientes, loading, fetchData } = useData(); 
  // Obtém a função de logout e o perfil do fonoaudiólogo logado
  const { logout } = useAuth(); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtra para mostrar apenas as empresas (clientes do tipo 'PJ').
  // Numa futura evolução, poderíamos associar empresas a fonoaudiólogos específicos.
  const minhasEmpresas = useMemo(() => {
    if (!clientes) return [];
    return clientes.filter(c => c.tipo_cliente === 'PJ');
  }, [clientes]);

  const handleSelectCompany = (companyId) => {
    navigate(`/empresa/${companyId}/dashboard`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Função para ser chamada quando uma nova empresa é salva com sucesso no modal
  const handleEmpresaSalva = () => {
      // Força a re-busca dos dados para que a nova empresa apareça na lista
      fetchData();
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
          ) : (
            <Grid container spacing={3}>
              {minhasEmpresas.map((company) => (
                <Grid item xs={12} sm={6} md={4} key={company.id}>
                  <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3, transition: '0.3s', '&:hover': { transform: 'scale(1.03)' } }}>
                    <CardActionArea onClick={() => handleSelectCompany(company.id)} sx={{ flexGrow: 1, p: 2 }}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <BusinessIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: '600' }}>
                          {company.nome}
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

          { !loading && minhasEmpresas.length === 0 && (
             <Paper sx={{p: 4, textAlign: 'center', width: '100%', borderRadius: 3}}>
                <Typography color="text.secondary">Nenhuma empresa cadastrada ainda. Clique no botão acima para adicionar a sua primeira empresa.</Typography>
             </Paper>
          )}
        </Container>
      </Box>

      {/* O modal que lida com o fluxo de "usar uma vaga" para cadastrar a empresa */}
      <CadastrarEmpresaModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleEmpresaSalva}
      />
    </>
  );
};

export default CompanySelectionPage;


