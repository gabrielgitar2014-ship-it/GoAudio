import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Grid, Card, CardActionArea, CardContent, 
  Box, AppBar, Toolbar, Button, CircularProgress 
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import EmpresaModal from '../components/EmpresaModal';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const CompanySelectionPage = () => {
  const navigate = useNavigate();
  const { empresas, loading } = useData();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectCompany = (companyId) => {
    navigate(`/empresa/${companyId}/dashboard`);
  };

  const handleSaveEmpresa = (novaEmpresa) => {
    console.log("Nova empresa salva:", novaEmpresa);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
        <AppBar position="static" elevation={1} color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              GoAudio - Gestão de Saúde Auditiva
            </Typography>
            <Button 
              color="inherit" 
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 5, mb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Selecione uma Empresa
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Escolha um cliente para iniciar a gestão ou adicione um novo.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setIsModalOpen(true)}
              sx={{ borderRadius: '20px', textTransform: 'none', px: 4, py: 1 }}
            >
              Cadastrar Nova Empresa
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {empresas.map((company) => (
                <Grid item xs={12} sm={6} md={4} key={company.id}>
                  {/* Cartão com bordas mais suaves e curvas */}
                  <Card sx={{ 
                    height: '100%', 
                    borderRadius: '16px', // Bordas mais curvas
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    '&:hover': { 
                      transform: 'translateY(-5px)', 
                      boxShadow: '0 8px 25px -5px rgba(0,0,0,0.15)',
                    } 
                  }}>
                    <CardActionArea onClick={() => handleSelectCompany(company.id)} sx={{ height: '100%', display: 'flex' }}>
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        {/* Ícone menor */}
                        <BusinessIcon sx={{ 
                          fontSize: 48, 
                          color: 'primary.main', 
                          mb: 2 
                        }} />
                        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: '600' }}>
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
        </Container>
      </Box>
      <EmpresaModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmpresa}
      />
    </>
  );
};

export default CompanySelectionPage;

