import React, { useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LightTheme, NavigationContext, UserProvider } from './src/Context'
import { CustomToast } from './src/Components';
import ThemeProvider from './src/ThemeProvider';
import AppNavigator from './src/AppNavigator';

const Stack = createStackNavigator();

export default function App() {
  const [notificationNavigation, setNotificationNavigation] = useState(false);

  return (
    <ThemeProvider>
      <UserProvider>
        <NavigationContext.Provider value={{ notificationNavigation, setNotificationNavigation }}>
          <NavigationContainer>
            <AppNavigator />    
            <CustomToast />
          </NavigationContainer>
        </NavigationContext.Provider>
      </UserProvider>
    </ThemeProvider>
  );
}
