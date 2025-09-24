import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Box 
} from '@mui/material';
import ResultsPanel from './ResultsPanel';

const initialAudiogramData = [
  { freq: 250, od_ac: null, oe_ac: null, od_bc: null, oe_bc: null },
  { freq: 500, od_ac: null, oe_ac: null, od_bc: null, oe_bc: null },
  { freq: 1000, od_ac: null, oe_ac: null, od_bc: null, oe_bc: null },
  { freq: 2000, od_ac: null, oe_ac: null, od_bc: null, oe_bc: null },
  { freq: 3000, od_ac: null, oe_ac: null, od_bc: null, oe_bc: null },
  { freq: 4000, od_ac: null, oe_ac: null, od_bc: null, oe_bc: null },
  { freq: 6000, od_ac: null, oe_ac: null, od_bc: null, oe_bc: null },
  { freq: 8000, od_ac: null, oe_ac: null, od_bc: null, oe_bc: null },
];

const AudiogramModal = ({ open, onClose, onSave, savedData }) => {
  // Estado local para guardar os dados que estão a ser inseridos
  const [localAudiogramData, setLocalAudiogramData] = useState(initialAudiogramData);

  useEffect(() => {
    if (open) {
      const dataToLoad = savedData && savedData.length > 0 ? savedData : initialAudiogramData;
      setLocalAudiogramData(dataToLoad);
    }
  }, [open, savedData]);

  // A função que é chamada ao clicar em "Salvar Exame"
  const handleSave = () => {
    // Chama a função onSave que foi passada pela página LancamentoAudiometria,
    // enviando os dados mais recentes que foram inseridos.
    onSave(localAudiogramData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
      <DialogTitle>Lançamento de Resultados Audiométricos</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>
          <ResultsPanel
            initialData={localAudiogramData} 
            // setLocalAudiogramData é passado para o ResultsPanel.
            // Sempre que um dado é alterado lá, o estado localAudiogramData aqui é atualizado.
            onAudiogramDataChange={setLocalAudiogramData} 
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Salvar Exame</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AudiogramModal;