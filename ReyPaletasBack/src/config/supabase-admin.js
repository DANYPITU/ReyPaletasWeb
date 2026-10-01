const { createClient } = require('@supabase/supabase-js');

let client = null;

function getClient() {
  if (client) return client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  const missing = [];
  if (!supabaseUrl) missing.push('SUPABASE_URL');
  if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_KEY');
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno de Supabase: ${missing.join(', ')}`);
  }

  client = createClient(supabaseUrl, supabaseServiceKey, {
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
