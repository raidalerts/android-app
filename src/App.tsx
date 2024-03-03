import React, { useEffect } from 'react';
import TopBar from './components/topbar.component';
import ConnectedDevice from './components/connected-device.component';
import { AppService } from './services/app.service';
import { BluetoothService } from './services/bt.service';
import BleManager from 'react-native-ble-manager';
import messaging from '@react-native-firebase/messaging';
import { refreshFcmToken, handleIncomingFcmMessage } from './utils';

export default function App() {
  useEffect(() => {
    let unsubscribe = () => {
      /* do nothing */
    };
    async function doEffect() {
      await AppService.requestPermissions();
      await refreshFcmToken();
      await BluetoothService.requestPermissions();
      await BleManager.start({ showAlert: false });
      unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.log('App -> onMessage', remoteMessage);
        try {
          await handleIncomingFcmMessage(remoteMessage);
        } catch (e) {
          console.error(e);
        }
      });
    }
    doEffect().catch((e) => console.error(e));
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <>
      <TopBar />
      <ConnectedDevice />
    </>
  );
}
