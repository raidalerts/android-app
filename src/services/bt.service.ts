import { PermissionsAndroid, Platform } from 'react-native';
import BleManager, { Peripheral } from 'react-native-ble-manager';

export class BluetoothService {
  private initialized = false;

  async init() {
    if (!this.initialized) {
      await BleManager.start({ showAlert: false });
      this.initialized = true;
    }
    return this;
  }

  static async requestPermissions(): Promise<void> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
      } else if (Platform.Version >= 23) {
        const res = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (!res) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
        }
      }
    }
  }

  async scanConnectedDevices(filters?: string[]): Promise<Peripheral[]> {
    if (!this.initialized) {
      throw new Error('BluetoothService have to be initialized before use');
    }
    return await BleManager.getConnectedPeripherals(filters);
  }
}
