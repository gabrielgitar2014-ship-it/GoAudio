import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Box, CircularProgress, Typography } from '@mui/material'; // Para uma tela de loading melhor

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // A função agora é auto-invocada e tem um try...catch para lidar com erros
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (profileError) throw profileError;
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Erro ao buscar sessão e perfil:", error);
        // Em caso de erro, garantimos que o logout é feito para evitar loops
        setUser(null);
        setProfile(null);
      } finally {
        // Esta linha é executada SEMPRE, quer haja sucesso ou erro
        setLoading(false);
      }
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setProfile(null); // Reseta o perfil para garantir que buscamos o novo

        if (session?.user) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            if (profileError) throw profileError;
            setProfile(profileData);
          } catch (error) {
            console.error("Erro ao buscar perfil no onAuthStateChange:", error);
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const registerWithMasterKey = async (chaveMestra, email, password, dadosAdicionais) => {
    return supabase.functions.invoke('registrar-novo-usuario', {
        body: {
            chave_mestra: chaveMestra,
            email: email,
            password: password,
            dados_adicionais: dadosAdicionais,
        },
    });
  };

  const value = {
    user,
    profile,
    loading,
    login,
    logout,
    registerWithMasterKey,
  };

  // Uma tela de carregamento mais informativa e profissional
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>A carregar sessão...</Typography>
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};