import React, { useState, useEffect } from 'react';
import { View, Image, Alert } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './styles';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { LoadingOverlay } from '../../components/loading-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../../../model/products';

import { useNavigation } from '@react-navigation/native';
import { getCurrentUser } from '../../../utils/auth';

const validationSchema = Yup.object().shape({
  name: Yup.string().min(6, 'Mínimo 6 caracteres').required('Informe o nome'),
  description: Yup.string().required('Informe a descrição'),
  price: Yup.number().typeError('Informe um preço válido').required('Informe o preço'),
});

export default function ProductRegistration() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    getCurrentUser().then(user => {
      if (!user || user.userType !== 'Admin') {
        Alert.alert('Acesso negado', 'Apenas administradores podem acessar esta tela.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        setIsAdmin(true);
      }
    });
  }, []);

  const escolherImagem = async () => {
    if (!isAdmin) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita acesso às imagens para continuar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveProduct = async (productData: Product) => {
    try {
      const existingProducts = await AsyncStorage.getItem('products');
      let products: Product[] = existingProducts ? JSON.parse(existingProducts) : [];
      products.push(productData);
      await AsyncStorage.setItem('products', JSON.stringify(products));
      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar o produto:', error);
      Alert.alert('Erro', 'Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = (values: any) => {
    if (!imageUri) {
      Alert.alert('Erro', 'Selecione uma imagem para o produto.');
      return;
    }

    setLoading(true);

    const newProduct: Product = {
      id: Date.now().toString(),
      name: values.name,
      description: values.description,
      price: Number(values.price),
      imageUri: imageUri,
    };

    saveProduct(newProduct);
  };

  if (!isAdmin) return null;

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />
      <Formik
        initialValues={{ name: '', description: '', price: '' }}
        validationSchema={validationSchema}
        onSubmit={handleCadastro}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
          <>
            <TextInput label="Nome do prato" value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} mode="outlined" error={touched.name && !!errors.name} />
            <HelperText type="error" visible={touched.name && !!errors.name}>{errors.name}</HelperText>

            <TextInput label="Descrição" value={values.description} onChangeText={handleChange('description')} onBlur={handleBlur('description')} mode="outlined" multiline numberOfLines={4} error={touched.description && !!errors.description} />
            <HelperText type="error" visible={touched.description && !!errors.description}>{errors.description}</HelperText>

            <TextInput label="Preço" value={values.price} onChangeText={handleChange('price')} onBlur={handleBlur('price')} mode="outlined" keyboardType="decimal-pad" error={touched.price && !!errors.price} />
            <HelperText type="error" visible={touched.price && !!errors.price}>{errors.price}</HelperText>

            <Button mode="outlined" onPress={escolherImagem} style={styles.imageButton} textColor="#d32f2f">{imageUri ? 'Trocar Imagem' : 'Selecionar Imagem'}</Button>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

            <Button mode="contained" onPress={() => handleSubmit()} style={styles.submitButton} buttonColor="#d32f2f" disabled={!isValid || !dirty}>Cadastrar Produto</Button>
          </>
        )}
      </Formik>
    </View>
  );
}
