import React, { useState } from 'react';
import { Outlet, NavLink as RouterNavLink, useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, IconButton, Divider, Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import HearingIcon from '@mui/icons-material/Hearing';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const drawerWidth = 260;

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { empresas } = useData();

  const empresaAtual = empresas.find(e => e.id === parseInt(companyId));

  // 1. O menu principal agora contém apenas as páginas de gestão da empresa
  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: `/empresa/${companyId}/dashboard` },
    { text: 'Funcionários', icon: <PeopleIcon />, path: `/empresa/${companyId}/funcionarios` },
    { text: 'Lançar Audiometria', icon: <AssessmentIcon />, path: `/empresa/${companyId}/audiometrias` },
    { text: 'Gerenciar Exames', icon: <ListAltIcon />, path: `/empresa/${companyId}/exames` },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawerContent = (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        backgroundColor: '#111827',
        color: '#e5e7eb',
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2.5 }}>
        <HearingIcon sx={{ color: '#60a5fa' }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>GoAudio</Typography>  
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      
      <List sx={{ flexGrow: 1 }}>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterNavLink}
              to={item.path}
              onClick={() => setDrawerOpen(false)}
              sx={{
                margin: '4px 8px',
                borderRadius: '8px',
                '&.active': {
                  backgroundColor: 'rgba(96, 165, 250, 0.2)',
                  color: '#60a5fa',
                  '& .MuiListItemIcon-root': {
                    color: '#60a5fa',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#9ca3af', minWidth: '40px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* 2. O rodapé agora contém AMBOS os botões e só aparece para o admin */}
      {user?.role === 'fono' && (
        <Box>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={RouterNavLink} to={'/'} onClick={() => setDrawerOpen(false)} sx={{ margin: '4px 8px', borderRadius: '8px' }}>
                <ListItemIcon sx={{ color: '#9ca3af', minWidth: '40px' }}><BusinessIcon /></ListItemIcon>
                <ListItemText primary={'Trocar Empresa'} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ margin: '4px 8px', borderRadius: '8px' }}>
                <ListItemIcon sx={{ color: '#9ca3af', minWidth: '40px' }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary={'Sair (Admin)'} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1, 
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {empresaAtual?.razao_social || 'Carregando...'}
          </Typography>

          {user?.role === 'empresa' && (
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Sair
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
        <Toolbar />
        <Outlet />
      </Box>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' } }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default MainLayout;