import { PermissionsAndroid, Platform } from 'react-native';

export class AppService {
  static async requestPermissions() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  }
}
