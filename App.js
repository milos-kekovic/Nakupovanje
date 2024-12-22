import React, { useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LightTheme, UserContext, NavigationContext } from './src/Context'
import { CustomToast } from './src/Components';
import ThemeProvider from './src/ThemeProvider';
import AppNavigator from './src/AppNavigator';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [notificationNavigation, setNotificationNavigation] = useState(false);

  return (
    <ThemeProvider>
      <UserContext.Provider value={{ user, setUser }}>
        <NavigationContext.Provider value={{ notificationNavigation, setNotificationNavigation }}>
          <NavigationContainer>
            <AppNavigator />    
            <CustomToast />
          </NavigationContainer>
        </NavigationContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}
