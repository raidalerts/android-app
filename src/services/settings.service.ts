import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_NOTIFICATION_TIMESTAMP_KEY = 'last_notification_timestamp';

export class SettingsService {
  static async setLastNotificationTimestamp(timestamp: number) {
    await AsyncStorage.setItem(
      LAST_NOTIFICATION_TIMESTAMP_KEY,
      timestamp.toString(),
    );
  }

  static async getLastNotificationTimestamp(): Promise<number> {
    const result = await AsyncStorage.getItem(LAST_NOTIFICATION_TIMESTAMP_KEY);
    if (result) {
      return parseInt(result, 10);
    }
    return 0;
  }
}
