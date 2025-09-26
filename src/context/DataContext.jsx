import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [exames, setExames] = useState([]);
  const [evolucoes, setEvolucoes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      // Não definimos setLoading(true) aqui para evitar loops de recarregamento
      // quando a função é chamada manualmente para atualizar os dados.
      const [clientesRes, funcionariosRes, examesRes, evolucoesRes, agendamentosRes] = await Promise.all([
        supabase.from('clientes').select('*').order('nome'),
        supabase.from('funcionarios').select('*').order('nome'),
        supabase.from('exames').select('*').order('data_exame', { ascending: false }),
        supabase.from('evolucoes').select('*').order('created_at', { ascending: false }),
        supabase.from('agendamentos').select('*').order('data_agendamento', { ascending: true }),
      ]);

      // Verificação de erros para cada consulta
      if (clientesRes.error) throw clientesRes.error;
      if (funcionariosRes.error) throw funcionariosRes.error;
      if (examesRes.error) throw examesRes.error;
      if (evolucoesRes.error) throw evolucoesRes.error;
      if (agendamentosRes.error) throw agendamentosRes.error;

      // Define os estados, garantindo que sejam sempre um array
      setClientes(clientesRes.data || []);
      setEmpresas((clientesRes.data || []).filter(c => c.tipo_cliente === 'PJ'));
      setFuncionarios(funcionariosRes.data || []);
      setExames(examesRes.data || []);
      setEvolucoes(evolucoesRes.data || []);
      setAgendamentos(agendamentosRes.data || []);
      
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Busca os dados iniciais quando a aplicação é montada pela primeira vez
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- FUNÇÕES DE ESCRITA E ATUALIZAÇÃO ---

  const addCliente = async (novoCliente) => {
    const { data, error: err } = await supabase.from('clientes').insert([novoCliente]).select();
    if (err) { console.error(err); return { error: err }; }
    fetchData(); // Re-busca todos os dados para manter tudo sincronizado
    return { data: data[0] };
  };

  const addFuncionario = async (novoFuncionario) => {
    const { data, error: err } = await supabase.from('funcionarios').insert([novoFuncionario]).select();
    if (err) { console.error(err); return { error: err }; }
    fetchData();
    return { data: data[0] };
  };
  
  const addExame = async (novoExame) => {
    const { data, error: err } = await supabase.from('exames').insert([novoExame]).select();
    if (err) { console.error(err); return { error: err }; }
    fetchData();
    return { data: data[0] };
  };
  
  const addEvolucao = async (novaEvolucao) => {
    const { data, error: err } = await supabase.from('evolucoes').insert([novaEvolucao]).select();
    if (err) { console.error(err); return { error: err }; }
    fetchData();
    return { data: data[0] };
  };

  const addAgendamento = async (novoAgendamento) => {
    const { data, error: err } = await supabase.from('agendamentos').insert([novoAgendamento]).select();
    if (err) { console.error(err); return { error: err }; }
    fetchData();
    return { data: data[0] };
  };

  const updateFuncionario = async (id, updates) => {
    const { data, error: err } = await supabase.from('funcionarios').update(updates).eq('id', id).select();
    if (err) { console.error(err); return { error: err }; }
    fetchData();
    return { data: data[0] };
  };

  // O objeto 'value' que o nosso "cérebro" fornece para toda a aplicação
  const value = {
    clientes,
    empresas,
    funcionarios,
    exames,
    evolucoes,
    agendamentos,
    loading,
    error,
    fetchData, // A função para re-buscar os dados
    addCliente,
    addFuncionario,
    addExame,
    addEvolucao,
    addAgendamento,
    updateFuncionario,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};