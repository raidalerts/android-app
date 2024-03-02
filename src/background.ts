import auth from '@react-native-firebase/auth';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { refreshFcmToken, handleIncomingFcmMessage } from './utils';

export const backgroundTask = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  console.log('Background task started handling the message', remoteMessage);
  if (!auth().currentUser) {
    console.log('currentUser is undefined. Calling refreshFcmToken() async');
    refreshFcmToken().catch((e) => console.error(e));
  }
  try {
    await handleIncomingFcmMessage(remoteMessage);
    console.log('FCM -> BT Device', remoteMessage);
  } catch (e) {
    console.error(e);
  }
};
