import React, {useState} from 'react';
import {FlatList, Image, View} from 'react-native';
import {Card, Text, TextInput} from 'react-native-paper';
import {styles} from './styles';
import {products} from "../../model/products";

export default function MenuList() {
  const [busca, setBusca] = useState('');
  const [produtos, setProdutos] = useState(products);

  const filtrarProdutos = (texto: string) => {
    setBusca(texto);
    const filtrados = products.filter((produto) =>
      produto.name.toLowerCase().includes(texto.toLowerCase())
    );
    setProdutos(filtrados);
  };

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
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.price}>{item.price}</Text>
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