import { createClient } from '@supabase/supabase-js';

// 1. Acede às variáveis de ambiente através de 'import.meta.env' (o método do Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Cria e exporta o cliente Supabase usando as variáveis
export const supabase = createClient(supabaseUrl, supabaseKey);