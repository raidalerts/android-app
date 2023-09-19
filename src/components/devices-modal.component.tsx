import React from 'react';
import {
  List,
  Modal,
  Portal,
  Text,
  ActivityIndicator,
  Button,
} from 'react-native-paper';
import { useConnectedDevices } from '../hooks/use-connected-devices.hook';
import { Device } from '../devices/device.interface';

const containerStyle = { backgroundColor: 'white', padding: 10 };

interface DevicesModalProps {
  onDismiss: () => void;
  onSelect: (device: Device) => void;
}

export default function DevicesModal(props: DevicesModalProps) {
  const { scanning, retryScan, devices } = useConnectedDevices();
  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={() => props.onDismiss()}
        contentContainerStyle={containerStyle}
      >
        <List.Section>
          <List.Subheader>Available devices</List.Subheader>
          {scanning && <ActivityIndicator animating={true} />}
          {!devices && !scanning && (
            <>
              <Text style={{ textAlign: 'center' }}>No devices found</Text>
              <Button
                icon="search"
                mode="contained"
                style={{ marginTop: 20 }}
                onPress={retryScan}
              >
                Scan again
              </Button>
            </>
          )}
          {devices &&
            !scanning &&
            (() => {
              return (
                <>
                  {devices.map((device) => (
                    <List.Item
                      key={device.id}
                      title={device.name}
                      description={device.id}
                      left={() => <List.Icon icon="bluetooth" />}
                      onPress={() => {
                        props.onSelect(device);
                      }}
                    />
                  ))}
                </>
              );
            })()}
        </List.Section>
      </Modal>
    </Portal>
  );
}
