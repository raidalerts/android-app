import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceDto } from '../devices/device.interface';

const BLE_DEVICE_STORAGE_KEY = 'bt_device';

export class DeviceManager {
  static async storeDeviceInfo(deviceInfo: DeviceDto) {
    await AsyncStorage.setItem(
      BLE_DEVICE_STORAGE_KEY,
      JSON.stringify(deviceInfo),
    );
  }

  static async loadDeviceInfo(): Promise<DeviceDto | null> {
    const result = await AsyncStorage.getItem(BLE_DEVICE_STORAGE_KEY);
    if (result) {
      return JSON.parse(result) as DeviceDto;
    }
    return null;
  }
}
