import BleManager from 'react-native-ble-manager';
import { Device, DeviceDto } from './device.interface';
import { sleep } from '../utils';
import { Buffer } from 'buffer';

const SLEEP_AFTER_CONNECT_MS = 900;
const BASE_UUID = '0000%s-0000-1000-8000-00805f9b34fb';
const ALERT_NOTIFICATION_SERVICE_ID = '1811';
const NEW_ALERT_NOTIFICATION_CHARACTERISTIC =
  '00002a46-0000-1000-8000-00805f9b34fb';

const resolveUUID = (serviceId: string) => BASE_UUID.replace('%s', serviceId);

export class GenericDevice implements Device {
  private connected = false;

  private constructor(
    private _id: string,
    private _name: string,
    private muted: boolean,
  ) {}

  async connect(): Promise<void> {
    await BleManager.connect(this._id);
    await sleep(SLEEP_AFTER_CONNECT_MS);
    await BleManager.retrieveServices(this._id);
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await BleManager.disconnect(this._id, true);
      this.connected = false;
    }
  }

  get isConnected(): boolean {
    return this.connected;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get isMuted(): boolean {
    return this.muted;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  private async _ensureConnected() {
    await this.connect();
  }

  async sendSMSNotification(senderName: string, force = false): Promise<void> {
    await this._ensureConnected();
    if (this.muted && !force) {
      return;
    }
    const senderBytes = Buffer.from(senderName).toJSON().data;
    const headerBytes = [0x05, 0x01];
    const message = [...headerBytes, ...senderBytes];
    await BleManager.write(
      this._id,
      resolveUUID(ALERT_NOTIFICATION_SERVICE_ID),
      NEW_ALERT_NOTIFICATION_CHARACTERISTIC,
      message,
    );
  }

  async sendIncomingCallNotification(
    senderName: string,
    force = false,
  ): Promise<void> {
    await this._ensureConnected();
    if (this.muted && !force) {
      return;
    }
    const senderBytes = Buffer.from(senderName).toJSON().data;
    const headerBytes = [0x03, 0x01];
    const message = [...headerBytes, ...senderBytes];
    await BleManager.write(
      this._id,
      resolveUUID(ALERT_NOTIFICATION_SERVICE_ID),
      NEW_ALERT_NOTIFICATION_CHARACTERISTIC,
      message,
    );
  }

  toDeviceDto(): DeviceDto {
    return {
      id: this.id,
      name: this.name,
      muted: this.isMuted,
    };
  }

  static fromDeviceDto(dto: DeviceDto): GenericDevice {
    return new GenericDevice(dto.id, dto.name, dto.muted);
  }
}
