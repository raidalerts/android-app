import BleManager from 'react-native-ble-manager';
import { DeviceManager } from './services/device-manager.service';
import { GenericDevice } from './devices/generic.device';
import auth from '@react-native-firebase/auth';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { refreshFcmToken } from './utils';

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
  console.log('Background task started handling the message', remoteMessage);
  if (!auth().currentUser) {
    console.log('currentUser is undefined. Calling refreshFcmToken() async');
    refreshFcmToken().catch((e) => console.error(e));
  }
  try {
    await BleManager.start({ showAlert: false });
    const deviceInfo = await DeviceManager.loadDeviceInfo();

    if (deviceInfo && !deviceInfo.muted) {
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
