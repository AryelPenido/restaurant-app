import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../route-types';
import { LoadingOverlay } from '../../components/loading-overlay';
import { Formik } from 'formik';
import * as Yup from 'yup';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('Informe o email'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Informe a senha'),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<Navigation>();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Home');
      }, 2000);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />

      <Image
        source={require('../../../assets/logotipo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
          <>
            <TextInput
              label="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              error={touched.email && !!errors.email}
            />
            <HelperText type="error" visible={touched.email && !!errors.email}>
              {touched.email && errors.email}
            </HelperText>

            <TextInput
              label="Senha"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
              mode="outlined"
              error={touched.password && !!errors.password}
            />
            <HelperText type="error" visible={touched.password && !!errors.password}>
              {touched.password  && errors.password}
            </HelperText>

            <TouchableOpacity onPress={() => console.log('Esqueceu a senha')}>
              <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              buttonColor="#d32f2f"
              style={styles.loginButton}
              disabled={!isValid || !dirty}
            >
              Entrar
            </Button>
          </>
        )}
      </Formik>

      <Text style={styles.footerText}>
        Você não tem uma conta?{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('UserRegistration')}
        >
          Crie uma
        </Text>
      </Text>
    </View>
  );
}