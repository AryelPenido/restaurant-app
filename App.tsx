import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/view/login/index';
import Home from './src/view/home/index';
import ProductRegistration from './src/view/product-registration/index';
import MenuList from './src/view/menu-list/index';
import RestaurantRegistration from './src/view/restaurant-registration/index';
import Onboarding from './src/view/onboarding/index';
import UserRegistration from "./src/view/user-registration/index";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Onboarding"
            component={Onboarding}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: 'Entre na tela inicial' }}
          />

          <Stack.Screen
            name="ProductRegistration"
            component={ProductRegistration}
            options={{ title: 'Cadastre um produto' }}
          />

          <Stack.Screen
            name="UserRegistration"
            component={UserRegistration}
            options={{ title: 'Cadastre um usuário' }}
          />

          <Stack.Screen
            name="MenuList"
            component={MenuList}
            options={{ title: 'Lista de cardápio' }}
          />

          <Stack.Screen
            name="RestaurantRegistration"
            component={RestaurantRegistration}
            options={{ title: 'Cadastro de restaurante' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
