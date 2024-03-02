import BleManager from 'react-native-ble-manager';
import { Device, DeviceDto } from './device.interface';
import { Buffer } from 'buffer';

const SLEEP_AFTER_CONNECT_MS = 900;
const BASE_UUID = '0000%s-0000-1000-8000-00805f9b34fb';
const ALERT_NOTIFICATION_SERVICE_ID = '1811';
const NEW_ALERT_NOTIFICATION_CHARACTERISTIC =
  '00002a46-0000-1000-8000-00805f9b34fb';

const MAX_MESSAGE_LENGTH = 23;
const INCOMING_CALL_NOTIFICATION_TYPE = 0x03;
const SMS_NOTIFICATION_TYPE = 0x05;
const HEADER_DELIMITER = 0x01;

const resolveUUID = (serviceId: string) => BASE_UUID.replace('%s', serviceId);

export const sleep = (ms: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
};

export class GenericDevice implements Device {
  private connected = false;

  private constructor(
    private _id: string,
    private _name: string,
    private muted: boolean,
  ) {}

  async connect(): Promise<void> {
    await BleManager.start({ showAlert: false });
    await BleManager.connect(this._id);
    console.log('Connected to', this._id);
    await sleep(SLEEP_AFTER_CONNECT_MS);
    console.log('Retrieving services for', this._id);
    await BleManager.retrieveServices(this._id);
    console.log('Retrieved services for', this._id);
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

  async sendSMSNotification(
    senderName: string,
    text = ' ',
    force = false,
  ): Promise<void> {
    await this._ensureConnected();
    if (this.muted && !force) {
      return;
    }
    const senderBytes = Buffer.from(senderName).toJSON().data;
    const headerBytes = [SMS_NOTIFICATION_TYPE, HEADER_DELIMITER];
    const textBytes = Buffer.from(
      text.slice(
        0,
        MAX_MESSAGE_LENGTH - headerBytes.length - senderBytes.length - 4,
      ),
    ).toJSON().data;
    // TODO: implement sending by chunks
    const message = [...headerBytes, ...senderBytes, 0x0, ...textBytes];
    await BleManager.write(
      this._id,
      resolveUUID(ALERT_NOTIFICATION_SERVICE_ID),
      NEW_ALERT_NOTIFICATION_CHARACTERISTIC,
      message,
    );
    console.log('Sent SMS notification to', this._id);
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
    const headerBytes = [INCOMING_CALL_NOTIFICATION_TYPE, HEADER_DELIMITER];
    const message = [...headerBytes, ...senderBytes];
    await BleManager.write(
      this._id,
      resolveUUID(ALERT_NOTIFICATION_SERVICE_ID),
      NEW_ALERT_NOTIFICATION_CHARACTERISTIC,
      message,
    );
    console.log('Sent incoming call notification to', this._id);
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
