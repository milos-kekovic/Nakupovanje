import React, { useContext, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { ThemeContext, UserContext } from '../Context';
import { CustomButton, ThemeInput } from '../Components';
import { fontSize as FS } from '../Constants/Dimensions';
import Logo from '../Components/Logo';

const BackgroundImage = require('../../assets/chocolate-background.jpg');

export default function HomeScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { setUser } = useContext(UserContext);
  const [userName, setUserName] = useState('');

  // Clear the TextInput when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setUserName(''); // Clear the userName input
    }, [])
  );

  return (
    <ImageBackground 
      style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.primaryColor}}
      source={BackgroundImage} 
      resizeMode="stretch"
    >
      <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
          <Logo isPopup={true} size={FS * 5} />
        </View>
        <View style={{flex: 0.6}}>
        <ThemeInput
          style={{ marginBottom: FS * 0.5}}
          label="Tvoje ime in priimek"
          required={true}
          returnKeyType="done"
          blurOnSubmit={false}
          clearButtonMode="always"
          multiline={false}
          value={userName}
          placeholder="Vpiši svoje ime in priimek"
          onChangeText={(text) => setUserName(text)}
        />
        <CustomButton
              text="Poglej izdelke"
              type="primary"            
              onButtonPress={() => {
                if (userName) {
                  setUser(userName); // Set the user name in context
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
