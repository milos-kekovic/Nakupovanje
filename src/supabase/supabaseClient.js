import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '@env'; // ✅ Use environment variables

console.log('SUPABASE_URL: ', SUPABASE_URL)
console.log('SUPABASE_KEY: ', SUPABASE_KEY)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ✅ Fetch languages from Supabase
export const fetchLanguages = async () => {
  try {
    const { data, error } = await supabase
    .from('languages')
    .select('language_code, language_name, flag_url') // ✅ Fetch only required columns
    if (error) throw error;
    
    console.log("✅ Languages from Supabase:", data); // 🔍 Debug log

    return data.map(lang => ({
      code: lang.language_code,
      label: lang.language_name, // ✅ Fetch language name directly from Supabase
      icon: { uri: lang.flag_url }, // ✅ Load flag from Supabase Storage
    }));
  } catch (error) {
    console.error('❌ Error fetching languages:', error.message);
    return [];
  }
};

// ✅ Fetch chocolates from Supabase
export const fetchChocolates = async () => {
  try {
    const { data, error } = await supabase.from('chocolates').select('*');
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching chocolates:', error.message);
    return [];
  }
};

// ✅ Fetch chocolate ingredients from Supabase
export const fetchIngredients = async () => {
  try {
    const { data, error } = await supabase.from('chocolate_ingredients').select('*');
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching ingredients:', error.message);
    return [];
  }
};

// ✅ Load translations dynamically from Supabase
export const loadTranslations = async (language = 'sl') => {
  try {
    console.log(`🔄 Fetching translations for: ${language}`);
    const { data, error } = await supabase
      .from('translations')
      .select('key, value')
      .eq('language_code', language);

    if (error) throw error;

    console.log('✅ Translations from Supabase:', data); // 🔍 Log data

    // Convert translations array into an object
    return data.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});
  } catch (error) {
    console.error('❌ Error loading translations:', error.message);
    return {};
  }
};

export default supabase;
