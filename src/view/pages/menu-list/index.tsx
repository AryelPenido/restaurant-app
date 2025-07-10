import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Image, View, StyleSheet } from 'react-native';
import { Card, Text, TextInput, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import { Product } from '../../../model/products';

export default function MenuList() {
  const [busca, setBusca] = useState('');
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      if (storedProducts !== null) {
        const parsedProducts: Product[] = JSON.parse(storedProducts);
        const productsWithIds = parsedProducts.map(p => ({
          ...p,
          id: p.id || `${p.name}-${Math.random().toString(36).substring(2, 9)}`,
        }));
        setAllProducts(productsWithIds);
        setProdutos(productsWithIds);
      } else {
        setAllProducts([]);
        setProdutos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos do AsyncStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      loadProducts();
      return () => {
        setBusca('');
      };
    }, [loadProducts])
  );

  const filtrarProdutos = (texto: string) => {
    setBusca(texto);
    const filtrados = allProducts.filter((produto) => // Filtra de `allProducts`
      produto.name.toLowerCase().includes(texto.toLowerCase())
    );
    setProdutos(filtrados);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator animating={true} color="#d32f2f" size="large" />
        <Text style={{ marginTop: 10, color: '#888' }}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Pesquisar produto pelo nome"
        value={busca}
        onChangeText={filtrarProdutos}
        mode="outlined"
        style={styles.input}
        left={<TextInput.Icon icon="magnify" />}
      />

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              {/* Use item.imageUri conforme definido na interface Product */}
              <Image source={{ uri: item.imageUri }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                {/* Formata o preço para exibição */}
                <Text style={styles.price}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto encontrado.</Text>}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}