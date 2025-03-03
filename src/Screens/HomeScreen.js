import React, { useContext, useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemeContext, UserContext } from '../Context';
import { CustomButton, ThemeInput, CustomPicker } from '../Components';
import Toast from 'react-native-toast-message';
import Logo from '../Components/Logo';
import { useTranslation } from 'react-i18next';
import { fetchLanguages, loadTranslations } from '../supabase/supabaseClient'; // ✅ Import languages from Supabase
import { useElementMargin, useElementSize } from '../Constants/Dimensions';

const BackgroundImage = require('../../assets/chocolate-background.jpg');

export default function HomeScreen({ navigation }) {
  const { user: { userName: userID, language }, setUser } = useContext(UserContext);
  const [userName, setUserName] = useState('');
  const { t, i18n } = useTranslation();
  const { theme } = useContext(ThemeContext);
  const [translations, setTranslations] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const scaledElementSize = useElementSize();
  const scaledElementMargin = useElementMargin();

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
      } catch (error) {
        console.error("❌ Error fetching languages:", error);
      }
    };
    loadLanguages();
  }, []);

  // ✅ Fetch translations when language changes
  useEffect(() => {
    if (!selectedLanguage) return;
    
    console.log(`Fetching translations for: ${selectedLanguage.code}`);
    
    const fetchData = async () => {
      try {
        const data = await loadTranslations(selectedLanguage.code);
        setTranslations(data);
        setUser(prevUser => ({ ...prevUser, translations: data }));
      } catch (error) {
        console.error("Error loading translations:", error);
      }
    };
    fetchData();
  }, [selectedLanguage]);

  // ✅ Reset the TextInput when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setUserName('');
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
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.primaryColor }}
      source={BackgroundImage} 
      resizeMode="stretch"
    >
      <View style={{
        flex: 0.4,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',  // ✅ Aligns to the right
        padding: scaledElementMargin
      }}>
        {/* ✅ Improved Language Picker UI */}
        <CustomPicker
          selectedValue={selectedLanguage}
          onValueChange={(value) => {
            setSelectedLanguage(value);
            i18n.changeLanguage(value.code);
            setUser(prevUser => ({ ...prevUser, language: value.code }));
          }}
          options={languages}
          placeholder={translations.choose_language}
        />
      </View>

      <View style={styles.mainContainer}>
        <Logo isPopup={true} size={scaledElementSize * 3} />

        {/* ✅ Improved ThemeInput */}
        <ThemeInput
          style={{ marginVertical: scaledElementMargin }}
          label={translations.first_and_last_name}
          required={true}
          returnKeyType="done"
          blurOnSubmit={false}
          clearButtonMode="always"
          multiline={false}
          value={userName}
          placeholder={translations.first_and_last_name}
          onChangeText={setUserName}
        />

        {/* ✅ Start Shopping Button */}
        <CustomButton
          text={translations.start_shopping}
          type="primary"
          onButtonPress={() => {
            if (userName.trim()) {
              setUser(prevUser => ({ ...prevUser, userName }));
              navigation.navigate('Products');
            } else {
              Toast.show({
                type: 'info',
                text1: translations.enter_name_warning,
                visibilityTime: 2500,
              });
            }
          }}
        />
      </View>
    </ImageBackground>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languagePickerContainer: {
    flex: 0.4,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',  // ✅ Aligns to the right
    paddingRight: 10,
  },
  mainContainer: {
    flex: 0.6,
    alignItems: 'center',
  },
});

