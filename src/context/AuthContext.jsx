// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sincroniza sessão e perfil
  useEffect(() => {
    const sync = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", currentUser.id)
            .single();
          if (!error) setProfile(data ?? null);
          else setProfile(null);
        } else {
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    };

    sync();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setProfile(null);

      if (currentUser) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", currentUser.id)
          .single();
        setProfile(data ?? null);
      }
    });

    return () => sub?.subscription?.unsubscribe();
  }, []);

  // 🔑 Nome EXATO do slug da Edge Function (pasta em supabase/functions)
  const EDGE_FUNCTION_NAME = "registrar-novo-usuario";

  /**
   * Registra administrador usando a chave mestra (licença) via Edge Function
   * A Edge espera: { chave_mestra, email, password, ...extra }
   */
  const registerWithMasterKey = async ({ chave_mestra, email, password, extra = {} }) => {
    try {
      const { data, error } = await supabase.functions.invoke(EDGE_FUNCTION_NAME, {
        body: { chave_mestra, email, password, ...extra },
      });
      if (error) {
        return { data: null, error };
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const login = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const logout = () => supabase.auth.signOut();

  const value = {
    user,
    profile,
    loading,
    login,
    logout,
    registerWithMasterKey, // ✅ exposto para o RegisterPage
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
