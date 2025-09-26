import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';

// Importa os nossos "cérebros" (Context Providers)
import { AuthProvider } from './context/AuthContext';

// Importa os componentes de rota e layout
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './Layouts/MainLayout';

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
      {/* O AuthProvider gere o estado de login/logout e o perfil do usuário */}
      <AuthProvider>
        {/* O componente <Routes> lê a URL atual e renderiza a primeira <Route> que corresponde.
          O <BrowserRouter> que o envolve já está no arquivo main.jsx.
        */}
        <Routes>
          {/* Rotas Públicas: Acessíveis a todos, mesmo sem login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas Protegidas: Todas as rotas aninhadas aqui dentro só serão acessíveis
            se o usuário estiver logado, conforme a lógica do nosso ProtectedRoute.
          */}
          <Route element={<ProtectedRoute />}>
          
            {/* Rota para o usuário "mestre" (fonoaudiólogo) selecionar qual empresa gerir */}
            <Route path="/selecionar-empresa" element={<CompanySelectionPage />} />

            {/* Rota Aninhada para o painel de uma empresa específica. 
              Todas as rotas aqui dentro partilham o mesmo layout (menu lateral, etc.) 
              fornecido pelo MainLayout.
            */}
            <Route path="/empresa/:companyId" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="funcionarios" element={<GerenciarFuncionarios />} />
              <Route path="funcionarios/:id" element={<FuncionarioDetalhe />} />
              <Route path="audiometrias" element={<LancamentoAudiometria />} />
              <Route path="exames" element={<GerenciarExames />} />
              <Route path="grafico" element={<ChartPage />} />
            </Route>

            {/* Rota Raiz: O que acontece quando o usuário acede a "/".
              Não renderizamos nenhum elemento aqui, pois o ProtectedRoute irá interceptar 
              a chamada e redirecionar o usuário para o destino correto 
              (/selecionar-empresa ou /empresa/:id/dashboard) com base no seu perfil.
            */}
            <Route path="/" element={null} />

          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
