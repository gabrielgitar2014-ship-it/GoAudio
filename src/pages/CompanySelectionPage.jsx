import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Grid, Card, CardActionArea, CardContent, 
  Box, AppBar, Toolbar, Button, CircularProgress 
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EmpresaModal from '../components/EmpresaModal';
import { useData } from '../context/DataContext'; // Importa o nosso hook

const CompanySelectionPage = () => {
  const navigate = useNavigate();
  // 1. Pega os dados E a função de salvar do nosso "cérebro"
  const { empresas, loading, addEmpresa } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectCompany = (companyId) => {
    navigate(`/empresa/${companyId}/dashboard`);
  };

  // 2. A função de salvar agora chama a função do DataContext
  const handleSaveEmpresa = async (novaEmpresa) => {
    const { error } = await addEmpresa(novaEmpresa);

    if (error) {
      alert("Ocorreu um erro ao salvar a empresa. Verifique o console.");
    } else {
      // Sucesso! A lista de empresas na tela será atualizada automaticamente
      // porque o DataContext notificou a alteração.
      console.log("Empresa salva com sucesso!");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              GoAudio - Gestão de Saúde Auditiva
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Selecione uma Empresa para Gerenciar
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Escolha uma das empresas abaixo ou adicione uma nova.
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {empresas.map((company) => (
                <Grid item xs={12} sm={6} md={4} key={company.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: 6 } }}>
                    <CardActionArea onClick={() => handleSelectCompany(company.id)} sx={{ flexGrow: 1 }}>
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <BusinessIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography gutterBottom variant="h6" component="div">
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