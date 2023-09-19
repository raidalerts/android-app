import React, { useState } from 'react';
import {
  ActivityIndicator,
  Divider,
  IconButton,
  List,
  Menu,
} from 'react-native-paper';
import NoDevices from './no-devices.component';
import { useSavedDevice } from '../hooks/use-saved-device.hook';

export default function ConnectedDevice() {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { loading, device, forgetDevice, saveDevice } = useSavedDevice();

  return (
    <List.Section>
      <List.Subheader>
        {device || loading ? 'Connected device' : 'No device connected'}
      </List.Subheader>
      {loading && <ActivityIndicator animating={true} />}
      {!device && !loading && <NoDevices onDeviceSelected={saveDevice} />}
      {device && !loading && (
        <List.Item
          title={device.name}
          description={device.id}
          left={() => <List.Icon icon="bluetooth" />}
          onLongPress={() => {
            device.sendSMSNotification('⚡Alert', true);
          }}
          right={() => (
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <IconButton icon="more-horiz" onPress={() => openMenu()} />
              }
            >
              <Menu.Item
                onPress={() => {
                  device.setMuted(!device.isMuted);
                }}
                title={
                  device.isMuted
                    ? 'Enable notifications'
                    : 'Disable notifications'
                }
                leadingIcon={
                  device.isMuted
                    ? 'notifications-muted'
                    : 'notifications-active'
                }
              />
              <Menu.Item
                onPress={() => {
                  device.sendIncomingCallNotification('⚡Alert', true);
                }}
                title="Test notification"
                leadingIcon="send"
              />
              <Divider />
              <Menu.Item
                onPress={forgetDevice}
                title="Disconnect"
                leadingIcon="delete"
              />
            </Menu>
          )}
        />
      )}
    </List.Section>
  );
}
