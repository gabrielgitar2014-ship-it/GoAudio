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
  const [localAudiogramData, setLocalAudiogramData] = useState([]);
  const [localParecer, setLocalParecer] = useState('');

  useEffect(() => {
    if (open) {
      const dataToLoad = savedData?.audiogramData && savedData.audiogramData.length > 0 ? savedData.audiogramData : initialAudiogramData;
      setLocalAudiogramData(dataToLoad);
      setLocalParecer(savedData?.resultado || '');
    }
  }, [open, savedData]);

  const handleDataChange = (data) => {
    setLocalAudiogramData(data.audiogramData);
    setLocalParecer(data.parecer);
  };

  const handleSave = () => {
    onSave({ 
      audiogramData: localAudiogramData, 
      resultado: localParecer 
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth="md">
      <DialogTitle>Lançamento de Resultados Audiométricos</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>
          <ResultsPanel
            initialData={localAudiogramData}
            initialParecer={localParecer}
            onDataChange={handleDataChange}
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