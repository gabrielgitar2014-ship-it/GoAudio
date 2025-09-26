import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import HearingIcon from '@mui/icons-material/Hearing';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <HearingIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        AudioFacility - Solução em gerenciamento
        </Typography>
      </Toolbar>
    </AppBar>
  );
};


export default Header;
