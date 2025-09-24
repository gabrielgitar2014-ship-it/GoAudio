import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
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
import { useAuth } from '../context/AuthContext';

const drawerWidth = 240;

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Itens principais do menu, visíveis para todos
  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: `/empresa/${companyId}/dashboard` },
    { text: 'Funcionários', icon: <PeopleIcon />, path: `/empresa/${companyId}/funcionarios` },
    { text: 'Audiometrias', icon: <AssessmentIcon />, path: `/empresa/${companyId}/audiometrias` },
  ];

  // Item do rodapé, específico do administrador
  const footerMenuItem = { text: 'Trocar Empresa', icon: <BusinessIcon />, path: `/` };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ color: 'primary.main' }}>Menu Principal</Typography>  
      </Toolbar>
      <Divider />
      
      {/* A lista principal cresce, empurrando o rodapé para baixo */}
      <List sx={{ flexGrow: 1 }}>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} onClick={handleDrawerToggle}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {/* O rodapé SÓ aparece se o utilizador for 'fono' */}
      {user?.role === 'fono' && (
        <Box>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to={footerMenuItem.path} onClick={handleDrawerToggle}>
                <ListItemIcon>{footerMenuItem.icon}</ListItemIcon>
                <ListItemText primary={footerMenuItem.text} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Gestão de Saúde Auditiva
          </Typography>

          {/* O botão de Sair SÓ aparece se o utilizador for da 'empresa' */}
          {user?.role === 'empresa' && (
            <Button 
              color="inherit" 
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Sair
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default MainLayout;

