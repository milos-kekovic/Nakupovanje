import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { CustomButton } from '../Components';
import { fetchChocolates, fetchIngredients } from '../supabase/supabaseClient'; // ✅ Import fetch functions

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [cart, setCart] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingIngredients, setLoadingIngredients] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(true); // State to toggle views
  const [selectedIngredients, setSelectedIngredients] = useState([]); // Track selected ingredients
  const [selectedChocolate, setSelectedChocolate] = useState(null); // Track selected chocolate

  useEffect(() => {
    const loadData = async () => {
      setLoadingProducts(true);
      setLoadingIngredients(true);

      const chocolates = await fetchChocolates();
      const chocolateIngredients = await fetchIngredients();

      setProducts(chocolates);
      setIngredients(chocolateIngredients);

      setLoadingProducts(false);
      setLoadingIngredients(false);
    };

    loadData();
  }, []);

  useEffect(() => {
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
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const toggleIngredient = (ingredient) => {
    console.log('selectedIngredients ', selectedIngredients)
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredient.id)
        ? prevSelected.filter((id) => id !== ingredient.id)
        : [...prevSelected, ingredient.id]
    );
  };

  const selectChocolate = (chocolate) => {
    setSelectedChocolate(chocolate.id);
  };

  return (
    <View style={styles.container}>
      {/* Toggle Buttons */}
      <View style={styles.buttonToggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, isContentVisible ? styles.activeButton : null]}
          onPress={() => setIsContentVisible(true)}
        >
          <Text style={styles.toggleButtonText}>Nakup čokoladnih izdelkov</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, !isContentVisible ? styles.activeButton : null]}
          onPress={() => setIsContentVisible(false)}
        >
          <Text style={styles.toggleButtonText}>Sestavi si čokolado sam</Text>
        </TouchableOpacity>
      </View>

      {/* Conditionally render content */}
      {isContentVisible ? (
        <View style={styles.container}>
          {loadingProducts ? (
            <Text>Loading products...</Text>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.product}>
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
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
          )}
          <CustomButton
            text="Konec nakupa"
            type="secondary"
            onButtonPress={() => {
              navigation.navigate('Cart', { cart });
            }}
          />
        </View>
      ) : (
        <View style={[styles.horizontalListContainer, { flexDirection: 'column', alignItems: 'center' }]}>
          {loadingIngredients ? (
            <Text>Loading ingredients...</Text>
          ) : (
            <>
              <FlatList
                data={ingredients}
                keyExtractor={(item) => item.id.toString()}
                horizontal={true} // Enable horizontal scrolling
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.imageButton,
                      selectedIngredients.includes(item.id) && styles.selectedItem,
                    ]}
                    onPress={() => toggleIngredient(item)}
                  >
                    <Image
                      source={{ uri: item.image_url + "?timestamp=" + new Date().getTime() }}
                      style={styles.productIngredientsImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.imageButtonText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false} // Hide horizontal scroll bar
                contentContainerStyle={{ paddingHorizontal: 10 }} // Adjust padding inside list
                ItemSeparatorComponent={() => <View style={styles.separator} />} // Add separator between items
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
                {products
                  .filter(
                    (product) =>
                      product.name === 'Temna čokolada' || product.name === 'Bela čokolada'
                  )
                  .map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.imageButton,
                        selectedChocolate === item.id && styles.selectedChocolate,
                      ]}
                      onPress={() => selectChocolate(item)}
                    >
                      <Image
                        source={{ uri: item.image_url }}
                        style={styles.chocolateType}
                        resizeMode="contain"
                      />
                      <Text style={styles.imageButtonText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </>
          )}
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
  buttonToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  activeButton: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  toggleButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  imageButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: 'green',
    backgroundColor: '#d4f5d4',
  },
  selectedChocolate: {
    borderColor: 'blue',
    backgroundColor: '#cce5ff',
  },
  productImage: {
    width: 80,
    height: 80,
  },
  productIngredientsImage: {
    width: 140,
    height: 120,
  },
  chocolateType: {
    width: 250,
    height: 250,
  },
  imageButtonText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
  horizontalListContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    //backgroundColor: '#ffe4b5', // Light yellow
    borderRadius: 10,
  },
  separator: {
    width: 10, // Space between items
  },
});
