import BleManager, { Peripheral } from 'react-native-ble-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BLEDevice } from './MiBand';

export const backgroundTask = async (remoteMessage: any) => {
  console.log('Message handled in the background!', remoteMessage);
  try {
    await BleManager.start({ showAlert: false });
    const mac = await AsyncStorage.getItem('mac');
    const miBand = new BLEDevice({ id: mac, name: mac } as Peripheral);
    await miBand.connect();
    await miBand.sendSMSNotification();
    console.log('FCM -> MiBand BG', remoteMessage);
  } catch (e) {
    console.error(e);
  }
};
