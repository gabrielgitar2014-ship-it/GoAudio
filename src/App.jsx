import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';

// Importa os nossos "cérebros" (Context Providers)
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

// Importa os componentes de rota e layout
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Importa todas as páginas da aplicação
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompanySelectionPage from './pages/CompanySelectionPage';
import DashboardPage from './pages/DashboardPage';
import GerenciarFuncionarios from './pages/GerenciarFuncionarios';
import FuncionarioDetalhe from './pages/FuncionarioDetalhe';
import LancamentoAudiometria from './pages/LancamentoAudiometria';
import ChartPage from './pages/ChartPage';
import GerenciarExames from './pages/GerenciarExames';
// A página de GerenciarEmpresas não é usada nesta aplicação, apenas na de admin
// import GerenciarEmpresas from './pages/GerenciarEmpresas';


// Define o tema visual da aplicação
const theme = createTheme({
  palette: {
    background: {
      default: '#f0f2f5', // Um fundo cinzento claro e profissional
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* O AuthProvider gere o estado de login/logout */}
      <AuthProvider>
        {/* O DataProvider busca e gere todos os dados do Supabase */}
        <DataProvider>
          <Routes>
            {/* Rotas Públicas: Acessíveis a todos */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rotas Protegidas: Só podem ser acedidas após o login */}
            <Route element={<ProtectedRoute />}>
            
              {/* Rota Raiz: Onde o fonoaudiólogo seleciona a empresa */}
              <Route path="/" element={<CompanySelectionPage />} />

              {/* Rota Aninhada: Todas as páginas dentro deste grupo partilham o mesmo layout */}
              <Route path="/empresa/:companyId" element={<MainLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="funcionarios" element={<GerenciarFuncionarios />} />
                <Route path="funcionarios/:id" element={<FuncionarioDetalhe />} />
                <Route path="audiometrias" element={<LancamentoAudiometria />} />
                <Route path="exames" element={<GerenciarExames />} />
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

