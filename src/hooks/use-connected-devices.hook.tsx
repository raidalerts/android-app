import { useState, useEffect } from 'react';
import { Device } from '../devices/device.interface';
import { BluetoothService } from '../services/bt.service';
import { GenericDevice } from '../devices/generic.device';

export const useConnectedDevices = (filters?: string[]) => {
  const [scanning, setScanning] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanError, setError] = useState(false);

  const retryScan = () => {
    setDevices([]);
    setScanning(true);
    setError(false);
  };

  const failScan = () => {
    setScanning(false);
    setError(true);
  };

  const scanSuccessful = (_devices: Device[]) => {
    setScanning(false);
    setDevices(_devices);
  };

  useEffect(() => {
    async function doEffect() {
      const service = new BluetoothService();
      try {
        await service.init();
        const peripherals = await service.scanConnectedDevices(filters);
        const _devices = peripherals.map((peripheral) =>
          GenericDevice.fromDeviceDto({
            id: peripheral.id,
            name: peripheral.name || 'Unknown',
            muted: false,
          }),
        );
        scanSuccessful(_devices);
      } catch (e) {
        failScan();
      }
    }
    if (scanning) {
      doEffect().catch(() => failScan);
    }
  }, [scanning, filters]);

  return { scanning, scanError, devices, retryScan };
};
