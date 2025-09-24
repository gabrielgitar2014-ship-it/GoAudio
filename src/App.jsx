import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import { DataProvider } from './context/DataContext';

import MainLayout from './layouts/MainLayout';
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

      <DataProvider>

      <Routes>
        <Route path="/" element={<CompanySelectionPage />} />
        {/* MUDANÇA AQUI: Usa o novo nome do componente na rota */}
        <Route path="/gerenciar-empresas" element={<GerenciarEmpresas />} />
        <Route path="/empresa/:companyId" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="funcionarios" element={<GerenciarFuncionarios />} />
          <Route path="funcionarios/:id" element={<FuncionarioDetalhe />} />
          <Route path="audiometrias" element={<LancamentoAudiometria />} />
          <Route path="grafico" element={<ChartPage />} />
        </Route>
      </Routes>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;