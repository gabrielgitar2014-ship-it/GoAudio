import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Grid, TextField
} from '@mui/material';

const EmpresaModal = ({ open, onClose, onSave }) => {
  // 1. Estado para controlar os campos do formulário
  const [formData, setFormData] = useState({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    cidade: '',
    estado: ''
  });

  // Limpa o formulário sempre que o modal é aberto
  useEffect(() => {
    if (open) {
      setFormData({
        razao_social: '',
        nome_fantasia: '',
        cnpj: '',
        cidade: '',
        estado: ''
      });
    }
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Validação básica para garantir que campos essenciais são preenchidos
    if (!formData.razao_social || !formData.cnpj) {
      alert("Por favor, preencha a Razão Social e o CNPJ.");
      return;
    }
    onSave(formData); // 2. Envia o objeto com os dados para a função onSave
    onClose(); // Fecha o modal
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
      <DialogContent>
        {/* 3. Os TextFields agora são "controlados" pelo estado */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField name="razao_social" label="Razão Social" value={formData.razao_social} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField name="nome_fantasia" label="Nome Fantasia" value={formData.nome_fantasia} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField name="cnpj" label="CNPJ" value={formData.cnpj} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="cidade" label="Cidade" value={formData.cidade} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="estado" label="Estado" value={formData.estado} onChange={handleChange} fullWidth />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmpresaModal;