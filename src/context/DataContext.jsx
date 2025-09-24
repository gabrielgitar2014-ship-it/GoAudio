import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [empresas, setEmpresas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [exames, setExames] = useState([]); // Adicionado estado para exames
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [empresasRes, funcionariosRes, examesRes] = await Promise.all([
        supabase.from('empresas').select('*').order('razao_social'),
        supabase.from('funcionarios').select('*').order('nome'),
        supabase.from('exames').select('*').order('data_exame', { ascending: false }), // Busca os exames
      ]);

      if (empresasRes.error) throw empresasRes.error;
      if (funcionariosRes.error) throw funcionariosRes.error;
      if (examesRes.error) throw examesRes.error; // Verifica erro dos exames

      setEmpresas(empresasRes.data);
      setFuncionarios(funcionariosRes.data);
      setExames(examesRes.data); // Guarda os exames no estado
      
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addEmpresa = async (novaEmpresa) => {
    const { data, error } = await supabase.from('empresas').insert([novaEmpresa]).select();
    if (error) { console.error(error); return { error }; }
    setEmpresas(prev => [...prev, data[0]].sort((a, b) => a.razao_social.localeCompare(b.razao_social)));
    return { data: data[0] };
  };

  const addFuncionario = async (novoFuncionario) => {
    const { data, error } = await supabase.from('funcionarios').insert([novoFuncionario]).select();
    if (error) { console.error(error); return { error }; }
    setFuncionarios(prev => [...prev, data[0]].sort((a, b) => a.nome.localeCompare(b.nome)));
    return { data: data[0] };
  };
  
  // NOVA FUNÇÃO: Adicionar um novo exame
  const addExame = async (novoExame) => {
    const { data, error } = await supabase
      .from('exames')
      .insert([novoExame])
      .select();

    if (error) {
      console.error("Erro ao adicionar exame:", error);
      return { error };
    }
    
    // Adiciona o novo exame ao topo da lista local
    setExames(prev => [data[0], ...prev]);
    return { data: data[0] };
  };

  const value = {
    empresas,
    funcionarios,
    exames, // Disponibiliza os exames
    loading,
    error,
    addEmpresa,
    addFuncionario,
    addExame, // Disponibiliza a função de adicionar exame
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};
