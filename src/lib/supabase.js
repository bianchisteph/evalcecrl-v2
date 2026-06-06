import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isMissingConfig = !supabaseUrl || !supabaseAnonKey;

if (isMissingConfig) {
  console.warn(
    '⚠️ Variables Supabase manquantes. Copiez .env.example vers .env et renseignez vos clés.\n' +
    'L\'application fonctionnera en mode démo limité.'
  );
}

// Créer le client Supabase seulement si les variables sont présentes
// Sinon, créer un client factice qui retourne des erreurs claires
export const supabase = isMissingConfig
  ? createMockClient()
  : createClient(supabaseUrl, supabaseAnonKey);

export const isConfigured = !isMissingConfig;

/**
 * Client factice pour le mode sans configuration Supabase.
 * Retourne des erreurs descriptives au lieu de planter.
 */
function createMockClient() {
  const mockError = {
    data: null,
    error: { message: 'Supabase non configuré. Consultez .env.example pour la configuration.' },
  };

  const chainable = {
    select: () => chainable,
    insert: () => chainable,
    update: () => chainable,
    delete: () => chainable,
    upsert: () => chainable,
    eq: () => chainable,
    in: () => chainable,
    order: () => chainable,
    single: () => chainable,
    then: (resolve) => resolve(mockError),
  };

  return {
    from: () => chainable,
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  };
}
