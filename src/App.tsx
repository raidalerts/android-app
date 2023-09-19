import React, { useEffect } from 'react';
import TopBar from './components/topbar.component';
import ConnectedDevice from './components/connected-device.component';
import { AppService } from './services/app.service';
import { BluetoothService } from './services/bt.service';
import BleManager from 'react-native-ble-manager';

export default function App() {
  useEffect(() => {
    async function doEffect() {
      await AppService.requestPermissions();
      await BluetoothService.requestPermissions();
      await BleManager.start({ showAlert: false });
    }
    doEffect().catch((e) => console.error(e));
  }, []);
  return (
    <>
      <TopBar />
      <ConnectedDevice />
    </>
  );
}
