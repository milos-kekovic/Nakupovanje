import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Image } from 'react-native';
import { CustomButton } from '../Components';
import { useNavigation } from '@react-navigation/native';
import supabase from '../supabaseClient';

/*const products = [
  { id: '1', name: 'Angel s krili', price: 15, image: require('../../assets/items/angel_s_krili.png') },
  { id: '2', name: 'Avto Hrošč', price: 20, image: require('../../assets/items/avto_hrosc.png') },
  { id: '3', name: 'Bela čokolada - sivka', price: 6, image: require('../../assets/items/bela_cokolada_sivka.png') },
];*/

export default function ProductsScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    //const nav = useNavigation();

    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('chocolates') // Supabase table name
        .select('*');       // Fetch all columns
  
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        console.log('data', data)
        setProducts(data);
      }
      setLoading(false);
    };

    useEffect(() => {
      fetchProducts();
    }, []);
  
    useEffect(() => {
      // Update the header with the cart count
      console.log('item added')
      navigation.setOptions({
        headerRight: () => (
          <View style={styles.cartContainer}>
            <Text style={styles.cartText}>🛒 {cart.length}</Text>
          </View>
        ),
      });
    }, [cart]);
  
    const addToCart = (product) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          // Increase quantity for existing item
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          // Add new item with quantity 1
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });
    };
  
    return (
      <View style={styles.container}>
        {loading ? (
          <Text>Loading products...</Text>
        ) : (
          <View style={styles.container}>
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.product}>
                  <Image source={{ uri: item.image_url }} style={styles.productImage} resizeMode="contain"/>
                  <View style={styles.productDetails}>
                    <Text style={styles.productText}>{item.name}</Text>
                    <Text style={styles.productPrice}>{item.price} €</Text>
                  </View>
                  <CustomButton
                    text="Dodaj v košarico"
                    type="secondary"            
                    onButtonPress={() => addToCart(item)}
                  />
                </View>
              )}
            />
            <CustomButton
              text="Konec nakupa"
              type="secondary"            
              onButtonPress={() => {navigation.navigate('Cart', { cart })}}
            />
          </View>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f5f1',
    },
    product: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    productImage: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 5,
    },
    productDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    productText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    productPrice: {
      fontSize: 16,
      color: '#555',
    },
    cartContainer: {
      marginRight: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
  });