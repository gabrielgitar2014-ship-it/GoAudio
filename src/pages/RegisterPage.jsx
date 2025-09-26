import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, Paper, Typography, TextField, Button, Box, CircularProgress, 
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({ 
    chaveMestra: '', 
    email: '', 
    password: '', 
    documento: '' 
  });
  
  const navigate = useNavigate();
  // A função no nosso AuthContext já está correta, vamos apenas usá-la
  const { registerWithMasterKey } = useAuth();

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
        setError("A palavra-passe deve ter pelo menos 6 caracteres.");
        return;
    }
    setLoading(true);
    setError('');

    // AQUI ESTÁ A LÓGICA CORRIGIDA:
    // Chamamos a função de registo diretamente com a Chave Mestra.
    const { error: registerError } = await registerWithMasterKey(
      formData.chaveMestra,
      formData.email,
      formData.password,
      { documento: formData.documento } // Passamos o documento como dados adicionais
    );

    if (registerError) {
      // A mensagem de erro agora virá diretamente da nossa Edge Function
      const errorMessage = registerError.message.includes('{') ? JSON.parse(registerError.message).error : registerError.message;
      setError(errorMessage);
    } else {
      alert("Conta de administrador criada com sucesso! Será redirecionado para a página de login.");
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" align="center">
          Ativação de Licença e Registo do Administrador
        </Typography>
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleRegister}>
          <Typography sx={{ my: 2 }} color="text.secondary">
            Insira a Chave Mestra e os seus dados para criar a sua conta de administrador.
          </Typography>
          <TextField 
            margin="normal" required fullWidth label="Chave Mestra" 
            name="chaveMestra" value={formData.chaveMestra} onChange={handleFormChange} 
          />
          <TextField 
            margin="normal" required fullWidth label="O seu Email" 
            name="email" type="email" value={formData.email} onChange={handleFormChange} 
          />
          <TextField 
            margin="normal" required fullWidth label="A sua Palavra-passe (mín. 6 caracteres)" 
            name="password" type="password" value={formData.password} onChange={handleFormChange} 
          />
          <TextField 
            margin="normal" required fullWidth label="O seu CPF" 
            name="documento" value={formData.documento} onChange={handleFormChange} 
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }} fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Criar Conta de Administrador"}
          </Button>
        </Box>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button component={RouterLink} to="/login" startIcon={<ArrowBackIcon />}>
                Voltar ao Login
            </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;