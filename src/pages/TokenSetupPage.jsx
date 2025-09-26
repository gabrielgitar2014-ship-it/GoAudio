import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, Paper, Typography, TextField, Button, Box, CircularProgress, 
  Alert, List, ListItem, ListItemText, Checkbox, FormControlLabel, IconButton,
  ListItemIcon
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { supabase } from '../supabaseClient';

const TokenSetupPage = () => {
  const [chaveMestra, setChaveMestra] = useState('');
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleValidateKey = async () => {
    setLoading(true);
    setError('');
    setTokens([]);
    const { data, error: funcError } = await supabase.functions.invoke('buscar-tokens-por-chave-mestra', {
      body: { chave_mestra: chaveMestra },
    });
    if (funcError) {
      const errorMessage = funcError.message.includes('{') ? JSON.parse(funcError.message).error : funcError.message;
      setError(errorMessage);
    } else {
      setTokens(data.tokens);
    }
    setLoading(false);
  };

  const handleCopy = (token) => {
    navigator.clipboard.writeText(token);
    alert('Token copiado para a área de transferência!');
  };

  // A NOVA FUNÇÃO PARA ATUALIZAR O STATUS DE ADMIN
  const handleAdminChange = async (tokenId, newAdminStatus) => {
    // Atualiza a UI instantaneamente para uma melhor experiência
    setTokens(prevTokens =>
      prevTokens.map(t =>
        t.id === tokenId ? { ...t, is_super_admin: newAdminStatus } : t
      )
    );

    // Chama a Edge Function para salvar a alteração na base de dados
    const { error: updateError } = await supabase.functions.invoke('atualizar-token-admin', {
      body: {
        token_id: tokenId,
        is_admin: newAdminStatus,
      },
    });

    if (updateError) {
      alert("Ocorreu um erro ao atualizar o status do token. Por favor, tente novamente.");
      // Reverte a alteração na UI em caso de erro
      setTokens(prevTokens =>
        prevTokens.map(t =>
          t.id === tokenId ? { ...t, is_super_admin: !newAdminStatus } : t
        )
      );
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography component="h1" variant="h5">
            Ativação de Tokens
          </Typography>
          <Button component={RouterLink} to="/login" startIcon={<ArrowBackIcon />}>
            Voltar ao Login
          </Button>
        </Box>
        <Typography color="text.secondary">
          Insira a sua Chave Mestra para visualizar e gerir os tokens de acesso.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 3 }}>
          <TextField
            fullWidth id="chaveMestra" label="Chave Mestra" name="chaveMestra"
            value={chaveMestra} onChange={(e) => setChaveMestra(e.target.value)}
          />
          <Button
            onClick={handleValidateKey}
            variant="contained"
            disabled={loading || !chaveMestra}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Validar Chave'}
          </Button>
        </Box>
        
        {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}

        {tokens.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>Tokens Filhos Disponíveis:</Typography>
            <List>
              {tokens.map(token => (
                <Paper key={token.id} variant="outlined" sx={{ mb: 1, p: 1, display: 'flex', alignItems: 'center' }}>
                  <ListItemIcon sx={{minWidth: '40px'}}><KeyIcon color="action" /></ListItemIcon>
                  <ListItemText 
                    primary={<code>{token.token}</code>}
                    secondary={token.description || 'Token de acesso'}
                  />
                  <IconButton size="small" onClick={() => handleCopy(token.token)}>
                      <ContentCopyIcon fontSize="small"/>
                  </IconButton>
                  {/* O CHECKBOX AGORA É FUNCIONAL */}
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={token.is_super_admin}
                        onChange={(e) => handleAdminChange(token.id, e.target.checked)}
                      />
                    }
                    label="É Admin?" 
                    sx={{ ml: 2, mr: 1 }}
                  />
                </Paper>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TokenSetupPage;
