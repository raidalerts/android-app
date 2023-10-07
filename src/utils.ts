import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

export type Nullable<T> = T | null;

export const sleep = (ms: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
};

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
