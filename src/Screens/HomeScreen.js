import React, { useContext, useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemeContext, UserContext } from '../Context';
import { CustomButton, ThemeInput, CustomPicker } from '../Components';
import { fontSize as FS } from '../Constants/Dimensions';
import Logo from '../Components/Logo';
import { useTranslation } from 'react-i18next';
import { fetchLanguages, loadTranslations } from '../supabase/supabaseClient'; // ✅ Import languages from Supabase

const BackgroundImage = require('../../assets/chocolate-background.jpg');

export default function HomeScreen({ navigation }) {
  const { user: { userName: userID, language }, setUser } = useContext(UserContext);
  const [userName, setUserName] = useState(''); // ✅ Add this line
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [translations, setTranslations] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(true);
  const [languages, setLanguages] = useState([]); // ✅ Store languages fetched from Supabase
  const selectedLanguageCode = language || i18n.language;
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // ✅ Fetch languages from Supabase
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        console.log("🔄 Fetching languages...");
        const fetchedLanguages = await fetchLanguages(); 

        if (!fetchedLanguages.length) {
          console.error("❌ No languages found in Supabase.");
          return;
        }

        setLanguages(fetchedLanguages);
        const initialLang = fetchedLanguages.find(lang => lang.code === language) || fetchedLanguages[0];
        setSelectedLanguage(initialLang);
        console.log("fetchedLanguages: ", fetchedLanguages);
      } catch (error) {
        console.error("❌ Error fetching languages:", error);
      }
    };
    loadLanguages();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      console.log(`Fetching translations for: ${selectedLanguage.code}`);
    }
  }, [selectedLanguage]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadTranslations(i18n.language);
        setTranslations(data);
        setUser(prevUser => ({ ...prevUser, translations: data }));
      } catch (error) {
        console.error("Error loading translations:", error);
      }
    };
    fetchData();
  }, [i18n.language]);

  // Clear the TextInput when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setUserName(''); // Clear the userName input
    }, [])
  );

  if (!translations || languages.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading translations...</Text>
      </View>
    );
  }

  return (
    <ImageBackground 
      style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.primaryColor}}
      source={BackgroundImage} 
      resizeMode="stretch"
    >
      <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
        {/* Language Dropdown */}
        <View style={{ width: '50%', backgroundColor: 'red' }}>
          <CustomPicker
            style={{ width: '100%' }}
            label={translations.choose_language}
            sort={false}
            selectedValue={selectedLanguage}
            onValueChange={(value) => {
              setSelectedLanguage(value);
              i18n.changeLanguage(value.code);
              setUser(prevUser => ({ ...prevUser, language: value.code }));
            }}
            options={languages}
          />
        </View>
        <Logo isPopup={true} size={FS * 5} />
        </View>
        <View style={{flex: 0.6}}>
        <ThemeInput
          key={forceUpdate}
          style={{ marginBottom: FS * 0.5}}
          label="Tvoje ime in priimek"
          required={true}
          returnKeyType="done"
          blurOnSubmit={false}
          clearButtonMode="always"
          multiline={false}
          value={userName}
          placeholder="Vpiši svoje ime in priimek"
          onChangeText={setUserName}
        />

        <CustomButton
          text={translations.start_quiz}
          type="primary"            
          onButtonPress={() => {
            if (userName) {
              setUser(prevUser => ({ ...prevUser, userName })); // Set the user name in context
              navigation.navigate('Products'); // Pass grid size to MemoryScreen
            } else {
              Toast.show({
                type: 'info',
                text1: 'Najprej vnesi svoje ime in priimek',
                visibilityTime: 2500,
              });
            }
          }}
        />
        </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
