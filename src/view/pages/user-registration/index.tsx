import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Menu, Divider, HelperText } from 'react-native-paper';
import { styles } from './styles';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { LoadingOverlay } from '../../components/loading-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../../model/user';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../route-types';

const validationSchema = Yup.object().shape({
  name: Yup.string().min(6, 'Mínimo 6 caracteres').required('Informe o nome'),
  email: Yup.string()
    .email('Email inválido')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email deve ter um domínio válido (ex: exemplo@dominio.com)'
    )
    .required('Informe o email'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Informe a senha'),
  userType: Yup.string().required('Informe o tipo do usuário'),
});

export default function UserRegistration() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const saveUser = async (userData: User) => {
    try {
      const existingUsers = await AsyncStorage.getItem('users');
      let users: User[] = existingUsers ? JSON.parse(existingUsers) : [];

      const emailExists = users.some(user => user.email === userData.email);
      if (emailExists) {
        Alert.alert('Erro no Cadastro', 'Este email já está cadastrado. Por favor, use outro email.');
        return false;
      }

      users.push(userData);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Erro ao salvar o usuário:', error);
      Alert.alert('Erro', 'Houve um erro ao salvar o usuário. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUser = async (values: any, { resetForm }: any) => {
    setLoading(true);

    const newUser: User = {
      id: Date.now().toString(),
      name: values.name,
      email: values.email,
      password: values.password,
      userType: values.userType,
    };

    const success = await saveUser(newUser);

    if (success) {
      resetForm();
      navigation.navigate('Login')
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />
      <Formik
        initialValues={{ name: '', email: '', password: '', userType: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitUser}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched, isValid, dirty }) => {
          const handleSelect = (value: 'Cliente' | 'Admin') => {
            setFieldValue('userType', value);
            setMenuVisible(false);
          };

          return <>
            <TextInput
              label="Nome completo"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              mode="outlined"
              error={touched.name && !!errors.name}
            />
            <HelperText type="error" visible={touched.name && !!errors.name}>
              {errors.name}
            </HelperText>

            <TextInput
              label="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              error={touched.email && !!errors.email}
            />
            <HelperText type="error" visible={touched.email && !!errors.email}>
              {errors.email}
            </HelperText>

            <TextInput
              label="Senha"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              mode="outlined"
              secureTextEntry
              error={touched.password && !!errors.password}
            />
            <HelperText type="error" visible={touched.password && !!errors.password}>
              {errors.password}
            </HelperText>

            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
                  style={styles.menuButton}
                  textColor="#d32f2f"
                >
                  {values.userType || 'Selecionar Tipo de Usuário'}
                </Button>
              }
            >
              <Menu.Item onPress={() => handleSelect('Cliente')} title="Cliente" />
              <Divider />
              <Menu.Item onPress={() => handleSelect('Admin')} title="Admin" />
            </Menu>
            <HelperText type="error" visible={touched.userType && !!errors.userType}>
              {errors.userType}
            </HelperText>

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              style={styles.submitButton}
              buttonColor="#d32f2f"
              disabled={!isValid || !dirty}
            >
              Cadastrar
            </Button>
          </>
        }}
      </Formik>
    </View>
  );
}
