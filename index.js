import { AppRegistry } from 'react-native';
import App from './App'; // Make sure App.js exists in the same directory
import { name as appName } from './app.json';
import { enableScreens } from 'react-native-screens';
import './src/localization/i18n'; // ✅ Import i18n for initialization

enableScreens();

AppRegistry.registerComponent(appName, () => App);
