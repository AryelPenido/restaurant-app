import React from 'react';
import { View, Modal } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { styles } from './styles';

interface LoadingOverlayProps {
  visible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <ActivityIndicator animating={true} size="large" color={MD2Colors.red800} />
      </View>
    </Modal>
  );
};