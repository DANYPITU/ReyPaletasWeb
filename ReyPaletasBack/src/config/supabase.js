const { createClient } = require('@supabase/supabase-js');

let client = null;

function getClient() {
  if (client) return client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  const missing = [];
  if (!supabaseUrl) missing.push('SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('SUPABASE_ANON_KEY');
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno de Supabase: ${missing.join(', ')}`);
  }

  client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

module.exports = new Proxy(
  {},
  {
    get(_target, prop) {
      const instance = getClient();
      const value = instance[prop];
      return typeof value === 'function' ? value.bind(instance) : value;
    },
  }
);
