import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import DevicesModal from './devices-modal.component';
import { Device } from '../devices/device.interface';

const styles = StyleSheet.create({
  card: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
});

interface NoDevicesProps {
  onDeviceSelected: (device: Device) => void;
}

export default function NoDevices(props: NoDevicesProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text>
          Please add a fitness tracker or smart watch device you want to receive
          alert notifications on. Note, that the device have to be paired with
          the phone before you can user it in this app.
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button icon="add" onPress={() => openModal()}>
          Add device
        </Button>
      </Card.Actions>
      {modalVisible && (
        <DevicesModal
          onDismiss={closeModal}
          onSelect={props.onDeviceSelected}
        />
      )}
    </Card>
  );
}
