import BleManager from 'react-native-ble-manager';
import { DeviceManager } from './services/device-manager.service';
import { GenericDevice } from './devices/generic.device';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

enum AttackerType {
  DRONE = 'DRONE',
  MISSILE = 'MISSILE',
  UNKNOWN = 'UNKNOWN',
}

interface PushNotificationData {
  alert: boolean;
  attacker: AttackerType;
  text: string;
}

export const backgroundTask = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  console.log('Message handled in the background!', remoteMessage);
  try {
    await BleManager.start({ showAlert: false });
    const deviceInfo = await DeviceManager.loadDeviceInfo();

    if (deviceInfo) {
      const device = GenericDevice.fromDeviceDto(deviceInfo);
      await device.connect();
      if (remoteMessage.data) {
        const data = remoteMessage.data as unknown as PushNotificationData;
        await device.sendIncomingCallNotification(`⚡${data.attacker}`);
      } else {
        await device.sendIncomingCallNotification('⚡Alert');
      }
    }
    console.log('FCM -> BT Device', remoteMessage);
  } catch (e) {
    console.error(e);
  }
};
