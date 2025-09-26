import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Grid, TextField
} from '@mui/material';
import { useData } from '../context/DataContext'; // Importa para pegar a lista de empresas

const FuncionarioModal = ({ open, onClose, onSave }) => {
  const { empresas } = useData(); // Pega a lista de empresas do cérebro
  const [formData, setFormData] = useState({
    nome: '', cpf: '', data_nascimento: '', matricula: '', funcao: ''
  });

  useEffect(() => {
    if (open) {
      setFormData({ nome: '', cpf: '', data_nascimento: '', matricula: '', funcao: '' });
    }
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.nome || !formData.matricula) {
      alert("Por favor, preencha o Nome e a Matrícula.");
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}><TextField name="nome" label="Nome Completo" value={formData.nome} onChange={handleChange} fullWidth required /></Grid>
          <Grid item xs={12} sm={6}><TextField name="cpf" label="CPF" value={formData.cpf} onChange={handleChange} fullWidth /></Grid>
          <Grid item xs={12} sm={6}><TextField name="data_nascimento" label="Data de Nascimento" value={formData.data_nascimento} onChange={handleChange} fullWidth type="date" InputLabelProps={{ shrink: true }} /></Grid>
          <Grid item xs={12} sm={6}><TextField name="matricula" label="Nº Matrícula" value={formData.matricula} onChange={handleChange} fullWidth required /></Grid>
          <Grid item xs={12} sm={6}><TextField name="funcao" label="Função / Cargo" value={formData.funcao} onChange={handleChange} fullWidth /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FuncionarioModal;