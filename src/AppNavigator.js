import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import HomeScreen from './Screens/HomeScreen';
import ProductsScreen from './Screens/ProductsScreen';
import CartScreen from './Screens/CartScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Dobrodošli' }} />
        <Stack.Screen name="Products" component={ProductsScreen} options={{ title: 'Čokoladni proizvodi',   // Custom title
          headerShown: true }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Košarica', headerShown: true }} />
    </Stack.Navigator>
  );
}
