import React, {useState, useContext, useRef} from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Modal, Button, Dimensions } from 'react-native';
import { CustomButton, ThemeText, ThemeInput, Popup } from '../Components';
import { UserContext } from '../Context'; // Adjust the path as needed
import QRCode from 'react-native-qrcode-svg';
import ThermalPrinterModule from 'react-native-thermal-printer';
import { captureRef } from 'react-native-view-shot'; // For converting QR to an image


const { height, width } = Dimensions.get('window');

export default function CartScreen({ route, navigation }) {
  const { user } = useContext(UserContext);
  const { cart } = route.params;
  const [cartData, setCartData] = useState(cart);
  const [userOrdersPopupVisibility, setUserOrdersPopupVisibility] = useState(false);
  const qrRef = useRef(); // Reference for the QR Code view
  //const [showQRModal, setShowQRModal] = useState(false);

  // Update the quantity dynamically
  const updateQuantity = (id, newQuantity) => {
    console.log('id: ', id)
    console.log('newQuantity: ', newQuantity)
    setCartData((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  // Calculate the total price for each product
  const getTotalForItem = (price, quantity) => (price * quantity).toFixed(2);

  // Calculate the grand total for all products
  const calculateGrandTotal = () => {
    return cartData.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  // Serialize cartData to generate QR code content
  const qrCodeData = `${user}: ${JSON.stringify(
    cartData.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      total: getTotalForItem(item.price, item.quantity),
    }))
  )}`;

  function renderOrdersPopup() {
    return (
      <Popup
        isVisible={userOrdersPopupVisibility}
        titleText={'Vaše naročilo'}
        cancelOption={true}
        onClose={() => setUserOrdersPopupVisibility(false)}
        onRightButtonPress={() => {setUserOrdersPopupVisibility(false); /*navigation.navigate('ListOfResultsScreen', { score })*/}}
        //messageText = {`Bravo, ${user}!\n${initialCorrectAnswers} od ${quizQuestions.length} točnih odgovorov\nUpoštevajoč tvoj čas, je tvoj rezultat: ${score}`}
        wrapContent = {
          <View style={{flex: 1,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',}}>
            <View 
              style={{
                borderRadius: 10,
                alignItems: 'center'
              }}
            >
              <QRCode value={qrCodeData} size={250} />
              <View style={{width: width * 0.5, flexDirection: 'row',
              alignItems: 'center', justifyContent: 'space-evenly', marginTop: '5%'}}>
                <CustomButton text='Zapri' onButtonPress={() => setUserOrdersPopupVisibility(false)} type={'secondary'} /*customWidth={width * 0.2} */style={{width: width * 0.1}}/>
                <CustomButton text='Natisni' onButtonPress={() => {setUserOrdersPopupVisibility(false); console.log('Zdaj pa printanje!'); printReceipt()}} type={'secondary'} /*customWidth={width * 0.2}*/ style={{width: width * 0.1}}/>
              </View>
            </View>
          </View>
        }
      />
    )
  }

  const printReceipt = async ({ user, cartData }) => {
    try {
      const printers = await ThermalPrinterModule.getBluetoothDeviceList();
      console.log('Available Printers:', printers);
  
      const targetPrinter = printers.find(
        (printer) => printer.deviceName === 'Cakalne vrste tiskalnik'
      );
  
      if (!targetPrinter) {
        alert('Printer "Cakalne vrste tiskalnik" not found!');
        return;
      }
  
      console.log(`Connecting to: ${targetPrinter.deviceName} - ${targetPrinter.macAddress}`);
  
      // Format the receipt content
      const receiptText =
        "Vaše naročilo\n" +
        "----------------------------\n" +
        `Kupec: ${user}\n` +
        "----------------------------\n" +
        cartData
          .map((item) => `${item.name} x${item.quantity}   ${item.price * item.quantity}€`)
          .join('\n') +
        "\n----------------------------\n" +
        `Skupaj: ${calculateGrandTotal(cartData)}€\n\n`;
  
      // Generate QR Code base64 data
      const qrCodeData = `${user}: ${JSON.stringify(
        cartData.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          total: item.price * item.quantity,
        }))
      )}`;
  
      let qrCodeBase64 = null;
  
      // Generate QR Code base64 string
      const qrCode = (
        <QRCode
          value={qrCodeData}
          size={200}
          getRef={(ref) => {
            if (ref) {
              ref.toDataURL((data) => {
                qrCodeBase64 = data;
              });
            }
          }}
        />
      );
  
      console.log('QR code generated:', qrCodeBase64);
  
      // Print receipt text
      console.log('Printing receipt text...');
      await ThermalPrinterModule.printBluetooth({
        payload: receiptText,
        macAddress: targetPrinter.macAddress,
      });
  
      await sleep(500);
  
      // Print QR Code image
      if (qrCodeBase64) {
        console.log('Printing QR Code image...');
        await ThermalPrinterModule.printBluetooth({
          payload: qrCodeBase64,
          macAddress: targetPrinter.macAddress,
          isImage: true,
        });
      } else {
        console.error('QR Code base64 data is null.');
      }
  
      // Feed and cut commands
      const feedAndCutCommand = '\x1B\x64\x03' + '\x1D\x56\x41';
      await ThermalPrinterModule.printBluetooth({
        payload: feedAndCutCommand,
        macAddress: targetPrinter.macAddress,
      });
  
      alert('Račun je natisnjen!');
    } catch (error) {
      console.error('Error printing receipt:', error);
      alert('Napaka pri tisku računa.');
    }
  };

  return (
    <View style={styles.container}>
      {renderOrdersPopup()}
      {/* QR Code Modal */}
      {/* <Modal visible={showQRModal} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.qrTitle}>Vaše naročilo</Text>
            <QRCode value={qrCodeData} size={250} />
            <Button title="Zapri" onPress={() => setShowQRModal(false)} />
          </View>
        </View>
      </Modal> */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Izdelek</Text>
        <Text style={styles.headerText}>Opis</Text>
        <Text style={styles.headerText}>Cena</Text>
        <Text style={styles.headerText}>Količina</Text>
        <Text style={styles.headerText}>Delna vsota</Text>
      </View>
      <View style={styles.listAndSummary}>
        <View style={styles.list}>
          <FlatList
            data={cartData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.tableRow}>
                <Image source={{ uri: item.image_url }} style={styles.productImage} />
                <View style={styles.productDescription}>
                  <Text style={styles.productName}>{item.name}</Text>
                </View>
                <Text style={styles.price}>{item.price.toFixed(2)} €</Text>
    
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Text style={styles.quantityButton}>-</Text>
                  </TouchableOpacity>
                  <TextInput                    
                    style={styles.quantityInput}
                    keyboardType="numeric"
                    value={item.quantity.toString()}
                    onChangeText={(value) =>
                      updateQuantity(item.id, parseInt(value) || 1)
                    }
                  />
                  <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Text style={styles.quantityButton}>+</Text>
                  </TouchableOpacity>
                </View>
    
                <Text style={styles.subtotal}>{getTotalForItem(item.price, item.quantity)} €</Text>
              </View>
            )}
          />
        </View>  
        <View style={styles.summary}>
          <ThemeText type='headerText'>Vaša košarica</ThemeText>
          <ThemeText type='freeText'>---------------------------</ThemeText>
          <ThemeText type='freeText'>Skupaj: {calculateGrandTotal()} EUR</ThemeText>
        </View>   
      </View>
      
      <View style={styles.footer}>
        <CustomButton
          text="Nazaj na nakupovanje"
          type="secondary"
          onButtonPress={() => navigation.goBack()} // Navigate back to ProductsScreen
        />
        <CustomButton
          text="Natisni račun"
          type="secondary"            
          onButtonPress={() => setUserOrdersPopupVisibility(true)} // Show QR code popup
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4ece4',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  header: {
    //flex: 0.2,
    width: '20%',
    padding: 20
  },
  headerText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    flex: 1,
  },
  productDescription: {
    flex: 2,
    paddingLeft: 10,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  productSize: {
    color: '#555',
    fontSize: 12,
  },
  listAndSummary: {
    flex: 1,
    flexDirection: 'row'
  },
  list: {
    flex: 1,
    width: '80%',
    padding: 20
  },
  summary: {
    //flex: 0.2,
    width: '20%',
    padding: 20,
    backgroundColor: '#371C0B'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItem: {
    fontSize: 18,
    marginBottom: 10,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },price: {
    flex: 1,
    textAlign: 'center',
    color: '#e44d26',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  quantityButton: {
    fontSize: 18,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityInput: {
    width: 40,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  subtotal: {
    flex: 1,
    textAlign: 'center',
    color: '#e44d26',
    fontWeight: 'bold',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 20,
  },
  footer: {
    //flex: 0.2,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  /*modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },*/
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
});
