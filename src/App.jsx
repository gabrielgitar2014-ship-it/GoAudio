import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';

// Importa os "cérebros" (Context Providers)
// O DataProvider foi removido, pois o AuthContext e as páginas agora gerem os seus próprios dados.
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
      default: '#f0f2f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* O AuthProvider gere o estado de login/logout e o perfil do usuário */}
      <AuthProvider>
        {/* O Router foi movido para dentro do AuthProvider para que as rotas tenham acesso ao contexto */}
        <Router>
          <Routes>
            {/* Rotas Públicas: Acessíveis a todos */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rotas Protegidas: Envolvidas pelo nosso novo ProtectedRoute inteligente */}
            {/* O componente 'element' do Route pai aplica a proteção a todas as rotas filhas */}
            <Route element={<ProtectedRoute />}>
            
              {/* Rota para o "cliente mestre" selecionar a empresa */}
              <Route path="/selecionar-empresa" element={<CompanySelectionPage />} />

              {/* Rota Aninhada para o dashboard de uma empresa específica */}
              {/* O MainLayout aplica o menu lateral, topo, etc. */}
              <Route path="/empresa/:companyId" element={<MainLayout />}>
                {/* O 'index' define a página padrão para /empresa/:companyId */}
                <Route index element={<DashboardPage />} /> 
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="funcionarios" element={<GerenciarFuncionarios />} />
                <Route path="funcionarios/:id" element={<FuncionarioDetalhe />} />
                <Route path="audiometrias" element={<LancamentoAudiometria />} />
                <Route path="exames" element={<GerenciarExames />} />
                <Route path="grafico" element={<ChartPage />} />
              </Route>

              {/* Rota Raiz: Aterragem padrão após o login. */}
              {/* O ProtectedRoute irá automaticamente redirecionar o usuário para a página correta 
                  (/selecionar-empresa ou /empresa/:id/dashboard) com base no seu perfil. */}
              <Route path="/" element={null} />

            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
