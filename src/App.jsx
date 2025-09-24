import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext'; 
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

import MainLayout from './Layouts/MainLayout';
import CompanySelectionPage from './pages/CompanySelectionPage';
import DashboardPage from './pages/DashboardPage';
// MUDANÇA AQUI: Importa o novo nome do ficheiro
import GerenciarEmpresas from './pages/GerenciarEmpresas'; 
import GerenciarFuncionarios from './pages/GerenciarFuncionarios';
import FuncionarioDetalhe from './pages/FuncionarioDetalhe';
import LancamentoAudiometria from './pages/LancamentoAudiometria';
import ChartPage from './pages/ChartPage';

const theme = createTheme({
  palette: {
    background: {
      default: '#f0f2f5',
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider> {/* 2. Envolva tudo com o AuthProvider */}
        <DataProvider>
          <Routes>
            {/* Rota pública de login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rotas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<CompanySelectionPage />} />
              <Route path="/gerenciar-empresas" element={<GerenciarEmpresas />} />
              <Route path="/empresa/:companyId" element={<MainLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="funcionarios" element={<GerenciarFuncionarios />} />
                <Route path="funcionarios/:id" element={<FuncionarioDetalhe />} />
                <Route path="audiometrias" element={<LancamentoAudiometria />} />
                <Route path="grafico" element={<ChartPage />} />
              </Route>
            </Route>

          </Routes>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
