import React, { useState, useEffect } from 'react';
import { 
  Tabs, Tab, Box, TextField, Typography, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

const FREQUENCIES = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000];

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index) => ({ id: `tab-${index}`, 'aria-controls': `tabpanel-${index}` });

const ResultsPanel = ({ initialData, initialParecer, onDataChange }) => {
  const [tabValue, setTabValue] = useState(0);
  const [professionalOpinion, setProfessionalOpinion] = useState('');
  const [audiometricInputs, setAudiometricInputs] = useState({});

  useEffect(() => {
    const inputs = { od_ac: {}, oe_ac: {}, od_bc: {}, oe_bc: {} };
    if (initialData && initialData.length > 0) {
      initialData.forEach(({ freq, od_ac, oe_ac, od_bc, oe_bc }) => {
        const format = (val) => (val === null || val === undefined ? '' : String(val));
        inputs.od_ac[freq] = format(od_ac);
        inputs.oe_ac[freq] = format(oe_ac);
        inputs.od_bc[freq] = format(od_bc);
        inputs.oe_bc[freq] = format(oe_bc);
      });
    }
    setAudiometricInputs(inputs);
    setProfessionalOpinion(initialParecer || '');
  }, [initialData, initialParecer]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getFormattedAudiogramData = (currentInputs) => {
    return FREQUENCIES.map(f => {
      const entry = { freq: f };
      ['od_ac', 'oe_ac', 'od_bc', 'oe_bc'].forEach(key => {
        const val = parseInt(currentInputs[key]?.[f], 10);
        entry[key] = isNaN(val) ? null : val;
      });
      return entry;
    });
  };
  
  const handleInputChange = (earKey, freq, value) => {
    const newInputs = {
      ...audiometricInputs,
      [earKey]: { ...audiometricInputs[earKey], [freq]: value },
    };
    setAudiometricInputs(newInputs);
    const formattedData = getFormattedAudiogramData(newInputs);
    onDataChange({ audiogramData: formattedData, parecer: professionalOpinion });
  };

  const handleOpinionChange = (event) => {
      const newOpinion = event.target.value;
      setProfessionalOpinion(newOpinion);
      const formattedData = getFormattedAudiogramData(audiometricInputs);
      onDataChange({ audiogramData: formattedData, parecer: newOpinion });
  };

  const renderTable = (earType, earKeyPrefix, color) => (
    <TableContainer component={Paper} elevation={1} sx={{ mb: 2 }}>
      <Typography variant="subtitle1" sx={{ p: 1.5, backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
        {earType} - <span style={{ color }}>{earKeyPrefix.toUpperCase()}</span>
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: '80px', fontWeight: 'bold' }}>Via</TableCell>
            {FREQUENCIES.map(freq => <TableCell key={freq} align="center" sx={{ fontWeight: 'bold' }}>{freq} Hz</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sx={{ color, fontWeight: 'bold' }}>Aérea</TableCell>
            {FREQUENCIES.map(freq => (
              <TableCell key={`ac-${earKeyPrefix}-${freq}`} align="center">
                <TextField
                  variant="outlined" size="small" type="number"
                  value={audiometricInputs[`${earKeyPrefix}_ac`]?.[freq] || ''}
                  onChange={(e) => handleInputChange(`${earKeyPrefix}_ac`, freq, e.target.value)}
                  sx={{ width: '65px' }} inputProps={{ style: { textAlign: 'center' } }}
                />
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell sx={{ color, fontWeight: 'bold' }}>Óssea</TableCell>
            {FREQUENCIES.map(freq => (
              <TableCell key={`bc-${earKeyPrefix}-${freq}`} align="center">
                <TextField
                  variant="outlined" size="small" type="number"
                  value={audiometricInputs[`${earKeyPrefix}_bc`]?.[freq] || ''}
                  onChange={(e) => handleInputChange(`${earKeyPrefix}_bc`, freq, e.target.value)}
                  sx={{ width: '65px' }} inputProps={{ style: { textAlign: 'center' } }}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Dados Audiométricos" {...a11yProps(0)} />
          <Tab label="Parecer Audiológico" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Box sx={{maxHeight: 'calc(60vh - 80px)', overflowY: 'auto', pr: 1 }}>
          {renderTable("Orelha Direita", "od", 'red')}
          {renderTable("Orelha Esquerda", "oe", 'blue')}
        </Box>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TextField
          label="Laudo / Parecer do Profissional" multiline rows={15} fullWidth variant="outlined"
          placeholder="Descreva aqui os resultados, conclusões e recomendações..."
          value={professionalOpinion} 
          onChange={handleOpinionChange}
        />
      </TabPanel>
    </Paper>
  );
};

export default ResultsPanel;