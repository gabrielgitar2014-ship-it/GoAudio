import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, CircularProgress, 
  Alert, List, ListItemButton, ListItemText, Stepper, Step, StepLabel,
  ListItemIcon, TextField, Divider, Typography
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { supabase } from '../supabaseClient';

const steps = ['Selecionar Vaga de Licença', 'Dados da Empresa e do Administrador'];

const CadastrarEmpresaModal = ({ open, onClose, onSave }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [availableTokens, setAvailableTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  
  // O formulário agora tem os dados da empresa E do utilizador
  const [formData, setFormData] = useState({ 
    nome: '', documento: '', cidade: '', estado: '', // Dados da empresa
    email: '', password: '' // Dados do utilizador
  });

  useEffect(() => {
    const fetchAvailableTokens = async () => {
      if (!open) return;
      setLoading(true);
      setError('');
      const { data, error: funcError } = await supabase.functions.invoke('buscar-vagas-disponiveis');
      if (funcError) {
          setError(funcError.message.includes('{') ? JSON.parse(funcError.message).error : funcError.message);
      } else {
          setAvailableTokens(data.tokens);
          if(data.tokens.length === 0) setError("Não há mais vagas de licença disponíveis.");
      }
      setLoading(false);
    };
    fetchAvailableTokens();
  }, [open]);

  const handleSelectToken = (token) => {
    setSelectedToken(token);
    setActiveStep(1);
  };

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterCompanyAndUser = async () => {
    if (!formData.nome || !formData.documento || !formData.email || !formData.password) {
        alert("Todos os campos são obrigatórios.");
        return;
    }
    setLoading(true);
    setError('');
    const { error: registerError } = await supabase.functions.invoke('registrar-empresa-com-token', {
      body: {
        token_filho: selectedToken.token,
        dados_empresa: {
          nome: formData.nome,
          documento: formData.documento,
          cidade: formData.cidade,
          estado: formData.estado
        },
        dados_usuario: {
          email: formData.email,
          password: formData.password
        }
      },
    });
    if (registerError) {
      setError(registerError.message.includes('{') ? JSON.parse(registerError.message).error : registerError.message);
    } else {
      alert("Empresa e utilizador administrador cadastrados com sucesso!");
      onSave();
      handleClose();
    }
    setLoading(false);
  };

  const handleClose = () => {
    setActiveStep(0);
    setAvailableTokens([]);
    setSelectedToken(null);
    setFormData({ nome: '', documento: '', cidade: '', estado: '', email: '', password: '' });
    setError('');
    onClose();
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mt: 1, mb: 3 }}>
          {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading && <Box sx={{display: 'flex', justifyContent: 'center'}}><CircularProgress /></Box>}

        {!loading && activeStep === 0 && availableTokens.length > 0 && (
          <List>
            {availableTokens.map(token => (
              <ListItemButton key={token.id} onClick={() => handleSelectToken(token)}>
                <ListItemIcon><KeyIcon /></ListItemIcon>
                <ListItemText primary={`Vaga de Licença #${token.id}`} secondary="Clique para usar esta vaga" />
              </ListItemButton>
            ))}
          </List>
        )}

        {!loading && activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>Dados da Empresa</Typography>
            <TextField margin="dense" required fullWidth label="Razão Social" name="nome" value={formData.nome} onChange={handleFormChange} />
            <TextField margin="dense" required fullWidth label="CNPJ" name="documento" value={formData.documento} onChange={handleFormChange} />
            <TextField margin="dense" fullWidth label="Cidade" name="cidade" value={formData.cidade} onChange={handleFormChange} />
            <TextField margin="dense" fullWidth label="Estado" name="estado" value={formData.estado} onChange={handleFormChange} />
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>Dados do Primeiro Utilizador (Admin)</Typography>
            <TextField margin="dense" required fullWidth label="Email do Administrador" name="email" type="email" value={formData.email} onChange={handleFormChange} />
            <TextField margin="dense" required fullWidth label="Palavra-passe (mín. 6 caracteres)" name="password" type="password" value={formData.password} onChange={handleFormChange} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        {activeStep === 1 && (
          <Button onClick={handleRegisterCompanyAndUser} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Salvar Empresa e Criar Utilizador"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CadastrarEmpresaModal;
