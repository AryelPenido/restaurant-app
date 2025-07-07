import React from 'react';
import { View, Image, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { styles } from './styles';

export default function Onboarding({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Pizza Image */}
      <Image
        source={require('../../../assets/pizza.png')}
        style={styles.image}
      />
      
      {/* Promo Phrase */}
      <Text style={styles.promoText}>
        Boa música e boa comida me fazem feliz.
      </Text>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          style={styles.registerButton}
          labelStyle={styles.registerButtonText}
          onPress={() => navigation.navigate('UserRegistration')}
        >
          Cadastrar-se
        </Button>
        <Button
          mode="contained"
          style={styles.loginButton}
          labelStyle={styles.loginButtonText}
          onPress={() => navigation.navigate('Login')}
        >
          Entrar
        </Button>
      </View>
    </View>
  );
}