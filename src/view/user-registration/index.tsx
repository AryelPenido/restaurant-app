import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, Menu, Divider, HelperText } from 'react-native-paper';
import { styles } from './styles';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { LoadingOverlay } from '../../components/loading-overlay/index';

const validationSchema = Yup.object().shape({
    name: Yup.string().min(6, 'Mínimo 6 caracteres').required('Informe o nome'),
    email: Yup.string().email('Email inválido').required('Informe o email'),
    password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Informe a senha'),
    userType: Yup.string().required('Informe o tipo do usuário'),
});

export default function UserRegistration() {
    const [menuVisible, setMenuVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmitUser = () => {
        // Lógica de envio
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Usuário cadastrado com sucesso!');
        }, 2000);
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
                    const handleSelect = (value: string) => {
                        setFieldValue('userType', value);
                    };

                    return <>
                        {/* Nome completo */}
                        <TextInput
                            label="Nome completo"
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            mode="outlined"
                            error={touched.name && !!errors.name}
                        />
                        <HelperText type="error" visible={touched.name && !!errors.name}>
                            {touched.name && errors.name}
                        </HelperText>

                        {/* Email */}
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
                            {touched.email && errors.email}
                        </HelperText>

                        {/* Senha */}
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
                            {touched.password && errors.password}
                        </HelperText>

                        {/* Tipo de usuário */}
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
                            <Menu.Item
                                onPress={() => {
                                    handleSelect('Cliente');
                                    setMenuVisible(false);
                                }}
                                title="Cliente"
                            />
                            <Divider />
                            <Menu.Item
                                onPress={() => {
                                    handleSelect('Admin');
                                    setMenuVisible(false);
                                }}
                                title="Admin"
                            />
                        </Menu>
                        <HelperText type="error" visible={touched.userType && !!errors.userType}>
                            {touched.userType && errors.userType}
                        </HelperText>

                        {/* Botão de envio */}
                        <Button mode="contained" onPress={() => handleSubmit()} style={styles.submitButton} buttonColor="#d32f2f" disabled={!isValid || !dirty}>
                            Cadastrar
                        </Button>
                    </>
                }}
            </Formik>
        </View>
    );
}