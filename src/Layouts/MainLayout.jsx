import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useParams } from 'react-router-dom';
import { 
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, IconButton, Divider 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';

const drawerWidth = 240;

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { companyId } = useParams();

  // 1. DIVIDIMOS OS ITENS DO MENU EM DOIS GRUPOS
  const mainMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: `/empresa/${companyId}/dashboard` },
    { text: 'Funcionários', icon: <PeopleIcon />, path: `/empresa/${companyId}/funcionarios` },
    { text: 'Audiometrias', icon: <AssessmentIcon />, path: `/empresa/${companyId}/audiometrias` },
  ];

  const footerMenuItem = { text: 'Trocar Empresa', icon: <BusinessIcon />, path: `/` };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // 2. O CONTEÚDO DO MENU AGORA USA FLEXBOX PARA POSICIONAR O RODAPÉ
  const drawerContent = (
    // O Box principal agora é um container flexível com direção de coluna
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ color: 'primary.main' }}>Menu Principal</Typography>  
      </Toolbar>
      <Divider />
      
      {/* A lista principal cresce para ocupar todo o espaço disponível, empurrando o rodapé para baixo */}
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
      
      {/* O rodapé */}
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
          <Typography variant="h6" noWrap component="div">
            Gestão de Saúde Auditiva
          </Typography>
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