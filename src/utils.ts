import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import BleManager from 'react-native-ble-manager';
import { DeviceManager } from './services/device-manager.service';
import { GenericDevice } from './devices/generic.device';
import { SettingsService } from './services/settings.service';

export type Nullable<T> = T | null;

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

const LONG_NOTIFICATION_DELAY_MS = 1000 * 60 * 15;

export const refreshFcmToken = async () => {
  console.log('signInAnonymously()');
  const credential = await auth().signInAnonymously();
  console.log('signInAnonymously() done', credential.user.uid);
  await messaging().registerDeviceForRemoteMessages();
  console.log('registerDeviceForRemoteMessages() done');
  const token = await messaging().getToken();
  const tokens = firestore().collection('fcm_tokens');
  await tokens
    .doc(credential.user.uid)
    .set({ uid: credential.user.uid, token, timestamp: Date.now() });
  console.log('Done updating fcm token');
};

export const handleIncomingFcmMessage = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  const lastNotificationTimestamp =
    await SettingsService.getLastNotificationTimestamp();
  await BleManager.start({ showAlert: false });
  const deviceInfo = await DeviceManager.loadDeviceInfo();
  console.log(
    'Last notification timestamp',
    new Date(lastNotificationTimestamp).toISOString(),
  );
  if (deviceInfo && !deviceInfo.muted) {
    const device = GenericDevice.fromDeviceDto(deviceInfo);
    await device.connect();
    if (remoteMessage.data) {
      const data = remoteMessage.data as unknown as PushNotificationData;
      if (Date.now() - lastNotificationTimestamp > LONG_NOTIFICATION_DELAY_MS) {
        await device.sendIncomingCallNotification(`⚡${data.attacker}`);
      } else {
        await device.sendSMSNotification(`⚡${data.attacker}`, data.text);
      }
    } else {
      if (Date.now() - lastNotificationTimestamp > LONG_NOTIFICATION_DELAY_MS) {
        await device.sendIncomingCallNotification('⚡Alert');
      } else {
        await device.sendSMSNotification('⚡Alert', 'Unknown alert');
      }
    }
    await SettingsService.setLastNotificationTimestamp(Date.now());
  }
};
