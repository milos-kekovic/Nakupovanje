import React, { useContext, useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Image 
} from 'react-native';
import { ThemeContext } from '../../Context/ThemeContext';
import { DownIcon } from '../../Components/Icons'; 
import { useFontSize, useElementPadding, useElementMargin, useElementSize, useBorderWidth, useBorderRadius } from '../../Constants/Dimensions';

export default function CustomPicker({ selectedValue, onValueChange, options, placeholder = 'Select a language' }) {
  const { theme } = useContext(ThemeContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const scaledFontSize = useFontSize();
  const scaledElementPadding = useElementPadding();
  const scaledElementMargin = useElementMargin();
  const scaledElementSize = useElementSize();
  const scaledBorderWidth = useBorderWidth();
  const scaledBorderRadius = useBorderRadius();

  useEffect(() => {
    if (selectedValue) {
      const foundItem = options.find(item => item.code === selectedValue.code);
      setSelectedItem(foundItem || null);
    }
  }, [selectedValue, options]);

  return (
    <View style={{ alignSelf: 'flex-start' }}> 
      {/* Only takes as much space as needed */}
      <TouchableOpacity 
        style = {
          {
            flexDirection: 'row',  // ✅ Keep flag, text, and icon aligned horizontally
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: scaledBorderWidth,
            borderRadius: scaledBorderRadius,
            alignSelf: 'flex-start',
            borderColor: theme.primaryColor,
            backgroundColor: theme.secondaryColor,
            padding: scaledElementPadding,
          }
        } 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        {selectedItem?.icon && (
          <Image 
            source={selectedItem.icon} 
            style={{ width: scaledElementSize, height: scaledElementSize, marginRight: 8 }} 
          />
        )}
        <Text style={[styles.buttonText, { fontSize: scaledFontSize, color: theme.primaryColor }]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <DownIcon size={scaledFontSize * 1.5} color={theme.text} name="chevron-down" type="material-community" />
      </TouchableOpacity>

      {/* Modal for Language Selection */}
      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.secondaryColor }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.code.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.item, 
                    selectedItem?.code === item.code && styles.selectedItem
                  ]}
                  onPress={() => {
                    setSelectedItem(item);
                    onValueChange(item);
                    setModalVisible(false);
                  }}
                >
                  {item.icon && (
                    <Image 
                      source={item.icon} 
                      style={{ width: scaledElementSize, height: scaledElementSize, marginRight: 10 }} 
                    />
                  )}
                  <Text style={[styles.itemText, { color: theme.primaryColor }]}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ✅ Updated Styles
const styles = StyleSheet.create({
  buttonText: {
    marginHorizontal: 5, // ✅ Small spacing to prevent stretching
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedItem: {
    backgroundColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
  },
});
