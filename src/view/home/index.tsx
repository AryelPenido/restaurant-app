import React from 'react';
import { View } from 'react-native';
import { Button, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../route-types';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export default function Home() {
    const navigation = useNavigation<Navigation>();

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Menu Principal</Title>

            <Button
                mode="contained"
                onPress={() => navigation.navigate('RestaurantRegistration')}
                style={styles.button}
                buttonColor="#d32f2f"
            >
                Cadastro de Restaurante
            </Button>

            <Button
                mode="contained"
                onPress={() => navigation.navigate('ProductRegistration')}
                style={styles.button}
                buttonColor="#d32f2f"
            >
                Cadastro de Produto
            </Button>

            <Button
                mode="contained"
                onPress={() => navigation.navigate('MenuList')}
                style={styles.button}
                buttonColor="#d32f2f"
            >
                Lista de Cardápio
            </Button>
        </View>
    );
}