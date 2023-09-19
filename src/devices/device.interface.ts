export interface DeviceDto {
  name: string;
  id: string;
  muted: boolean;
}

export interface Device {
  get id(): string;
  get name(): string;
  get isConnected(): boolean;
  get isMuted(): boolean;

  setMuted(muted: boolean): void;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendSMSNotification(senderName: string, force: boolean): Promise<void>;
  sendIncomingCallNotification(
    senderName: string,
    force: boolean,
  ): Promise<void>;

  toDeviceDto(): DeviceDto;
}
