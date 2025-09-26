// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { registerWithMasterKey /*, login */ } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [chaveMestra, setChaveMestra] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSubmitting(true);

    try {
      if (!chaveMestra || !email || !password) {
        throw new Error("Informe chave mestra, e-mail e senha.");
      }

      const { error } = await registerWithMasterKey({
        chave_mestra: chaveMestra, // ⚠️ nome em PT, como a Edge espera
        email,
        password,
      });

      if (error) {
        throw new Error(error.message ?? "Falha ao registrar.");
      }

      setSuccessMsg("Conta criada com sucesso! Você já pode fazer login.");
      // Opcional: login automático após criar
      // await login(email, password);
      // redirecionar após login ou sucesso…
    } catch (err) {
      setErrorMsg(err.message ?? "Erro ao registrar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Registrar Administrador</h1>
      <p style={{ color: "#555", marginBottom: 20 }}>
        Use a <strong>chave mestra</strong> da sua licença para criar o primeiro administrador.
      </p>

      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Chave Mestra
          <input
            type="text"
            value={chaveMestra}
            onChange={(e) => setChaveMestra(e.target.value)}
            placeholder="Insira a chave mestra"
            required
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            placeholder="seu@email.com"
            required
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: "100%",
            padding: 12,
            cursor: submitting ? "not-allowed" : "pointer",
            background: submitting ? "#8e8e8e" : "#6c2bd9",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          {submitting ? "Registrando..." : "Registrar"}
        </button>

        {errorMsg && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              background: "#ffe6e6",
              color: "#a30000",
              fontSize: 14,
            }}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              background: "#e6ffef",
              color: "#005c2f",
              fontSize: 14,
            }}
          >
            {successMsg}
          </div>
        )}
      </form>
    </div>
  );
}
