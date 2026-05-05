import { createClient } from '@supabase/supabase-js';

// 🔥 CONFIGURAÇÃO DIRETA (fallback seguro)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://sjzrfkdxscyumvplspqh.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpcXMiOiJzdXBhYmFzZSIsInJlZiI6InNqenJma2R4c2N5dW12cGxzcHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MzYwMTIsImV4cCI6MjA5MzUxMjAxMn0.FISX8hh6O14mDJlBOFjk7PsyahKNd15v2puvXMqZgtk";

// 🧠 VALIDAÇÃO FORTE
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Supabase ENV NÃO configurado corretamente.');
  throw new Error('Supabase não configurado');
}

// 🚀 CLIENTE ÚNICO
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false
  }
});

// 🔍 LOG DE DEBUG (remova em produção se quiser)
console.log('✅ Supabase conectado:', SUPABASE_URL);