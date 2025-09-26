import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, CircularProgress, 
  Alert, List, ListItemButton, ListItemText, Stepper, Step, StepLabel,
  ListItemIcon, TextField
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { supabase } from '../supabaseClient';

// Passos simplificados para o novo fluxo
const steps = ['Selecionar Vaga', 'Dados da Empresa'];

const CadastrarEmpresaModal = ({ open, onClose, onSave }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [availableTokens, setAvailableTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [companyData, setCompanyData] = useState({ nome: '', documento: '', cidade: '', estado: '' });
  // O estado 'userData' foi removido

  useEffect(() => {
    // ... (a lógica de buscar tokens continua a mesma) ...
    const fetchAvailableTokens = async () => {
      if (!open || activeStep !== 0) return;
      setLoading(true);
      setError('');
      const { data, error: funcError } = await supabase.functions.invoke('buscar-vagas-disponiveis');
      if (funcError) {
          const errorMessage = funcError.message.includes('{') ? JSON.parse(funcError.message).error : funcError.message;
          setError(errorMessage);
      } else {
          setAvailableTokens(data.tokens);
          if(data.tokens.length === 0) {
            setError("Não há mais vagas de licença disponíveis.");
          }
      }
      setLoading(false);
    };
    fetchAvailableTokens();
  }, [open, activeStep]);

  const handleSelectToken = (token) => {
    setSelectedToken(token);
    setActiveStep(1);
  };

  const handleCompanyFormChange = (e) => {
    setCompanyData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async () => {
    if (!companyData.nome || !companyData.documento) {
        setError("A Razão Social e o CNPJ são obrigatórios.");
        return;
    }
    setLoading(true);
    setError('');

    // A chamada da função agora envia apenas o token e os dados da empresa
    const { error: registerError } = await supabase.functions.invoke('registrar-empresa-com-token', {
      body: {
        token_filho: selectedToken.token,
        dados_empresa: companyData,
        // 'dados_usuario' foi removido
      },
    });

    if (registerError) {
      const errorMessage = registerError.message.includes('{') ? JSON.parse(registerError.message).error : registerError.message;
      setError(errorMessage);
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
    setCompanyData({ nome: '', documento: '', cidade: '', estado: '' });
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
        {loading && <Box sx={{display: 'flex', justifyContent: 'center', my: 3}}><CircularProgress /></Box>}

        {activeStep === 0 && (
          // ... (JSX de selecionar token continua o mesmo) ...
           <List>
            {availableTokens.map(token => (
              <ListItemButton key={token.id} onClick={() => handleSelectToken(token)}>
                <ListItemIcon><KeyIcon /></ListItemIcon>
                <ListItemText primary={`Vaga de Licença #${token.id}`} secondary="Clique para usar esta vaga" />
              </ListItemButton>
            ))}
          </List>
        )}

        {activeStep === 1 && (
          <Box component="form" noValidate>
            <TextField margin="normal" required fullWidth autoFocus label="Razão Social" name="nome" value={companyData.nome} onChange={handleCompanyFormChange} />
            <TextField margin="normal" required fullWidth label="CNPJ" name="documento" value={companyData.documento} onChange={handleCompanyFormChange} />
            <TextField margin="normal" fullWidth label="Cidade" name="cidade" value={companyData.cidade} onChange={handleCompanyFormChange} />
            <TextField margin="normal" fullWidth label="Estado" name="estado" value={companyData.estado} onChange={handleCompanyFormChange} />
          </Box>
        )}
        
        {/* O JSX para o activeStep 2 foi removido */}

      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancelar</Button>
        {activeStep === 1 && (
          <Button onClick={handleRegister} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Cadastrar Empresa"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CadastrarEmpresaModal;
