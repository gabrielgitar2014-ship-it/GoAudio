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
import { useAuth } from '../context/AuthContext'; // 1. Importe o nosso hook de autenticação

const drawerWidth = 240;

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { companyId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // 2. Obtenha os dados do utilizador e a função de logout

  // 3. CRIE O MENU DINAMICAMENTE COM BASE NA FUNÇÃO DO UTILIZADOR
  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: `/empresa/${companyId}/dashboard` },
    { text: 'Funcionários', icon: <PeopleIcon />, path: `/empresa/${companyId}/funcionarios` },
    { text: 'Audiometrias', icon: <AssessmentIcon />, path: `/empresa/${companyId}/audiometrias` },
  ];

  // Adiciona o botão "Trocar Empresa" APENAS se o utilizador for um fonoaudiólogo
  if (user?.role === 'fono') {
    mainMenuItems.push({ text: 'Trocar Empresa', icon: <BusinessIcon />, path: `/` });
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawerContent = (
    <div>
      <Toolbar>
        <Typography variant="h6" sx={{ color: 'primary.main' }}>Menu Principal</Typography>  
      </Toolbar>
      <Divider />
      <List>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.path} onClick={handleDrawerToggle}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
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

          {/* 4. EXIBA O BOTÃO DE LOGOFF NO HEADER APENAS SE FOR UM UTILIZADOR DE EMPRESA */}
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

