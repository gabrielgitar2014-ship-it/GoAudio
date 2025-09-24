import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Container, Paper, Typography, TextField, Button, Box, CircularProgress, Alert 
} from '@mui/material';

const LoginPage = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { user, error: authError } = await login(token);

    if (authError) {
      setError(authError);
    } else {
      // Redirecionamento inteligente com base na função
      if (user.role === 'fono') {
        navigate('/'); // Fonoaudiólogo vai para a seleção de empresas
      } else if (user.role === 'empresa' && user.empresaId) {
        navigate(`/empresa/${user.empresaId}/dashboard`); // Empresa vai direto para o seu dashboard
      } else {
        setError('Configuração de utilizador inválida.');
      }
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Acesso ao Sistema GoAudio
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="token"
            label="Token de Acesso"
            name="token"
            autoFocus
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;