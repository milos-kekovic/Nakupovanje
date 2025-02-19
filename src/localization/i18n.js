import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { loadTranslations } from '../supabase/supabaseClient'; // ✅ Import Supabase function

i18n.use(initReactI18next).init({
  lng: 'sl', // Default language
  compatibilityJSON: 'v4', //To make it work for Android devices, add this line.
  interpolation: { escapeValue: false },
  resources: {}, // ✅ Start with an empty resources object
});

/**
 * Load translations from Supabase dynamically and update i18n
 * @param {string} languageCode - Language code (e.g., 'en', 'sl', 'de')
 */
export const fetchAndSetTranslations = async (languageCode = 'en') => {
  try {
    console.log(`🔄 Fetching translations for: ${languageCode}`);
    const translations = await loadTranslations(languageCode);

    if (translations && Object.keys(translations).length > 0) {
      console.log(`✅ Applying translations for: ${languageCode}`);
      if (!i18n.hasResourceBundle(languageCode, 'translation')) {
        i18n.addResourceBundle(languageCode, 'translation', translations, true, true);
      }
      await i18n.changeLanguage(languageCode); // ✅ Wait for language change
    } else {
      console.warn(`⚠️ No translations found for: ${languageCode}`);
    }
  } catch (error) {
    console.error('❌ Error fetching translations:', error);
  }
};

export default i18n;
