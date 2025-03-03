import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { ThemeContext } from '../Context/ThemeContext'; 
import { ThemeText } from '../Components';
import { useElementPadding, useElementMargin, useElementSize, useBorderWidth, useBorderRadius } from '../Constants/Dimensions'; // ✅ Import dimensions

const CustomToast = () => {
  // Read theme context to get the current theme color
  const { theme } = useContext(ThemeContext);

  // Fetch dynamic values for padding, margin, and size
  const scaledElementPadding = useElementPadding();
  const scaledElementMargin = useElementMargin();
  const scaledElementSize = useElementSize();
  const scaledBorderWidth = useBorderWidth();
  const scaledBorderRadius = useBorderRadius();

  // Custom Toast Configuration
  const toastConfig = {
    info: ({ text1, props }) => (
      <View style={[styles.toastContainer, { 
        backgroundColor: theme.primaryColor, 
        padding: scaledElementPadding,
        borderWidth: scaledBorderWidth,
        borderRadius: scaledBorderRadius
      }]}>
        <ThemeText type="errorMessage">{text1}</ThemeText>
      </View>
    ),
  };

  return <Toast config={toastConfig} position="center" />;
};

const styles = StyleSheet.create({
  toastContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export default CustomToast;
