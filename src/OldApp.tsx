import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import BleManager, { Peripheral } from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Nullable, handleAndroidPermissions } from './utils';
import { BLEDevice } from './MiBand';

function App(): JSX.Element {
  const [connectedDevices, setConnectedDevices] = useState<Peripheral[]>([]);
  const [miBand, setMiBand] = useState<Nullable<BLEDevice>>(null);

  const retrieveConnected = async () => {
    try {
      const devices = await BleManager.getConnectedPeripherals();
      if (devices.length === 0) {
        console.warn('[retrieveConnected] No connected peripherals found.');
        return;
      }

      console.debug('[retrieveConnected] connectedPeripherals', devices);
      setConnectedDevices(devices);
    } catch (error) {
      console.error(
        '[retrieveConnected] unable to retrieve connected peripherals.',
        error,
      );
    }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log(remoteMessage);
      if (miBand) {
        miBand
          .sendSMSNotification()
          .then(() => console.log('FCM -> MiBand'))
          .catch((e) => console.error(e));
      }
    });
    return unsubscribe;
  }, [miBand]);

  useEffect(() => {
    try {
      handleAndroidPermissions()
        .then(() => BleManager.start({ showAlert: false }))
        .then(() => retrieveConnected())
        .catch((error) =>
          console.error('BeManager could not be started.', error),
        );
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backgroundColor = '#069400';

  const renderItem = ({ item }: { item: Peripheral }) => (
    <TouchableHighlight
      underlayColor="#0082FC"
      onPress={() => {
        if (!miBand) {
          const device = new BLEDevice(item);
          device
            .connect()
            .then(() => console.log(`Connected to ${device.id}`))
            .then(() => {
              setMiBand(device);
              return AsyncStorage.setItem('mac', item.id);
            })
            .catch((e) => console.error(e));
        } else {
          miBand
            .sendSMSNotification()
            .then(() => console.log('Notification sent'))
            .catch((e) => console.error(e));
        }
      }}
    >
      <View style={[styles.row, { backgroundColor }]}>
        <Text style={styles.peripheralName}>{item.name || '????'}</Text>
        <Text style={styles.peripheralId}>{item.id}</Text>
      </View>
    </TouchableHighlight>
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FlatList
        data={connectedDevices}
        contentContainerStyle={{ rowGap: 12 }}
        renderItem={renderItem}
        keyExtractor={(device) => device.id}
      />
    </View>
  );
}

const boxShadow = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 10,
    bottom: 0,
    color: Colors.black,
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#0a398a',
    margin: 10,
    borderRadius: 12,
    ...boxShadow,
  },
  scanButtonText: {
    fontSize: 20,
    letterSpacing: 0.25,
    color: Colors.white,
  },
  body: {
    backgroundColor: '#0082FC',
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  peripheralName: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
  },
  peripheralId: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
    paddingBottom: 20,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    ...boxShadow,
  },
  noPeripherals: {
    margin: 10,
    textAlign: 'center',
    color: Colors.white,
  },
});

export default App;
