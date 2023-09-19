import BleManager, { Peripheral } from 'react-native-ble-manager';
import { Nullable, sleep } from './utils';
import { Buffer } from 'buffer';

const SLEEP_AFTER_CONNECT_MS = 900;

export class BLEDevice {
  private connected = false;
  constructor(private device: Peripheral) {}

  async connect(): Promise<void> {
    await BleManager.connect(this.device.id);
    await sleep(SLEEP_AFTER_CONNECT_MS);
    await BleManager.retrieveServices(this.device.id);
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await BleManager.disconnect(this.device.id, true);
      this.connected = false;
    }
  }

  get isConnected(): boolean {
    return this.connected;
  }

  get id(): Nullable<string> {
    if (this.isConnected) {
      return this.device.id;
    }
    return null;
  }

  get name(): Nullable<string> {
    if (this.isConnected) {
      return this.device.name || null;
    }
    return null;
  }

  async sendSMSNotification(): Promise<void> {
    if (this.isConnected) {
      const alerts_id = '1811';
      const UUID_SERVICE_ALERT_NOTIFICATION = `0000${alerts_id}-0000-1000-8000-00805f9b34fb`;
      const sms = Buffer.from([0x05, 0x01, 0x74, 0x65, 0x73, 0x74]).toJSON()
        .data;
      // test
      //   const call = Buffer.from([0x03, 0x01, 0x74, 0x65, 0x73, 0x74]).toJSON()
      //     .data;
      await BleManager.write(
        this.device.id,
        UUID_SERVICE_ALERT_NOTIFICATION,
        '00002a46-0000-1000-8000-00805f9b34fb',
        sms,
      );
    }
  }
}
