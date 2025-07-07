import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B57',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 350,
    height: 550,
    borderBottomLeftRadius: 100, // Gives the half-circle effect
    overflow: 'hidden',
  },
  promoText: {
    position: 'absolute',
    top: 520,
    left: 20,
    fontSize: 40,
    color: '#242731',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingRight: 50,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 60,
  },
  registerButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  registerButtonText: {
    color: '#FF6B57',
    fontWeight: 'bold',
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#242731',
  },
  loginButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});