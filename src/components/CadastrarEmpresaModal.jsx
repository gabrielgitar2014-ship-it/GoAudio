import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, CircularProgress, 
  Alert, List, ListItemButton, ListItemText, Stepper, Step, StepLabel,
  ListItemIcon, TextField, Typography
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { supabase } from '../supabaseClient';

const steps = ['Selecionar Vaga de Licença', 'Dados da Empresa'];

const CadastrarEmpresaModal = ({ open, onClose, onSave }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [availableTokens, setAvailableTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [formData, setFormData] = useState({ nome: '', documento: '', cidade: '', estado: '' });

  // Busca as vagas disponíveis quando o modal abre
  useEffect(() => {
    const fetchAvailableTokens = async () => {
      if (!open) return;
      
      setLoading(true);
      setError('');
      
      const { data, error: funcError } = await supabase.functions.invoke('buscar-vagas-disponiveis');

      if (funcError) {
          const errorMessage = funcError.message.includes('{') ? JSON.parse(funcError.message).error : funcError.message;
          setError(errorMessage);
      } else {
          setAvailableTokens(data.tokens);
          // AQUI ESTÁ A LÓGICA: Se a resposta for uma lista vazia, define o erro.
          if(data.tokens.length === 0) {
            setError("Você não possui mais vagas de licença disponíveis para cadastrar novas empresas.");
          }
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

  const handleRegisterCompany = async () => {
    if (!formData.nome || !formData.documento) {
        alert("A Razão Social e o CNPJ são obrigatórios.");
        return;
    }
    setLoading(true);
    setError('');
    const { error: registerError } = await supabase.functions.invoke('registrar-empresa-com-token', {
      body: {
        token_filho: selectedToken.token,
        dados_empresa: formData,
      },
    });
    if (registerError) {
      setError(registerError.message.includes('{') ? JSON.parse(registerError.message).error : registerError.message);
    } else {
      alert("Empresa cadastrada com sucesso!");
      onSave();
      handleClose();
    }
    setLoading(false);
  };

  const handleClose = () => {
    setActiveStep(0);
    setAvailableTokens([]);
    setSelectedToken(null);
    setFormData({ nome: '', documento: '', cidade: '', estado: '' });
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
        {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
        {loading && <Box sx={{display: 'flex', justifyContent: 'center'}}><CircularProgress /></Box>}

        {/* Passo 1: Mostrar Vagas Disponíveis */}
        {!loading && activeStep === 0 && availableTokens.length > 0 && (
          <List>
            {availableTokens.map(token => (
              <ListItemButton key={token.id} onClick={() => handleSelectToken(token)}>
                <ListItemIcon><KeyIcon /></ListItemIcon>
                <ListItemText primary={`Vaga de Licença #${token.id}`} secondary="Clique para usar esta vaga e cadastrar uma empresa" />
              </ListItemButton>
            ))}
          </List>
        )}

        {/* AQUI ESTÁ A ALTERAÇÃO: Uma mensagem clara quando não há vagas */}
        {!loading && activeStep === 0 && availableTokens.length === 0 && !error && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="text.secondary">A carregar vagas de licença...</Typography>
            </Box>
        )}

        {/* Passo 2: Mostrar Formulário de Cadastro da Empresa */}
        {!loading && activeStep === 1 && (
          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleRegisterCompany(); }}>
            <TextField margin="normal" required fullWidth autoFocus label="Razão Social" name="nome" value={formData.nome} onChange={handleFormChange} />
            <TextField margin="normal" required fullWidth label="CNPJ" name="documento" value={formData.documento} onChange={handleFormChange} />
            <TextField margin="normal" fullWidth label="Cidade" name="cidade" value={formData.cidade} onChange={handleFormChange} />
            <TextField margin="normal" fullWidth label="Estado" name="estado" value={formData.estado} onChange={handleFormChange} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {availableTokens.length === 0 ? 'Fechar' : 'Cancelar'}
        </Button>
        {activeStep === 1 && (
          <Button onClick={handleRegisterCompany} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Salvar Empresa"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CadastrarEmpresaModal;
