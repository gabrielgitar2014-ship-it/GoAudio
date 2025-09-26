import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Container, Paper, Typography, TextField, Button, Box, CircularProgress, Alert,
  InputAdornment, IconButton, Divider 
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: loginError } = await login(email, password);

    if (loginError) {
      setError(loginError.message);
    } else {
      // O AuthContext irá detetar a mudança de sessão.
      // O componente ProtectedRoute irá então redirecionar o utilizador
      // para a página correta com base na sua função.
      navigate('/'); 
    }
    setLoading(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Acesso ao Sistema GoAudio
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal" required fullWidth id="email"
            label="Email" name="email" autoComplete="email" autoFocus
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal" required fullWidth name="password" label="Palavra-passe"
            type={showPassword ? 'text' : 'password'} id="password" autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          <Button
            type="submit" fullWidth variant="contained"
            sx={{ mt: 3, mb: 2 }} disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
          <Divider sx={{ my: 2 }}>Primeiro Acesso?</Divider>
          <Button
            component={RouterLink}
            to="/register"
            fullWidth
            variant="outlined"
          >
            Ativar Licença com Chave Mestra
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;