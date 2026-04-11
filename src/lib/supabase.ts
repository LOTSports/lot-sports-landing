import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Auto-fix: Se o usuário colou a URL do dashboard, tentamos converter para a URL da API
if (supabaseUrl && supabaseUrl.includes('supabase.com/dashboard')) {
  const projectIdMatch = supabaseUrl.match(/project\/([a-z0-9]+)/);
  if (projectIdMatch) {
    const projectId = projectIdMatch[1];
    supabaseUrl = `https://${projectId}.supabase.co`;
    console.warn(`AVISO: Você usou a URL do Dashboard. Convertendo automaticamente para a URL da API: ${supabaseUrl}`);
  } else {
    console.error('ERRO: Você está usando a URL do Dashboard do Supabase e não conseguimos extrair o ID do projeto. Use a URL da API (ex: https://xxx.supabase.co)');
  }
}

// Only initialize if we have the credentials
export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('supabase.com/dashboard')) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

if (!supabase) {
  console.warn('Supabase credentials missing. Real-time sync will be disabled.');
}
