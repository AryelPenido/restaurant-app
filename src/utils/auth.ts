import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../model/user';

export const getCurrentUser = async (): Promise<User | null> => {
  const data = await AsyncStorage.getItem('currentUser');
  return data ? JSON.parse(data) : null;
};