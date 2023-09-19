import { useState, useEffect } from 'react';
import { Device } from '../devices/device.interface';
import { Nullable } from '../utils';
import { DeviceManager } from '../services/device-manager.service';
import { GenericDevice } from '../devices/generic.device';

export const useSavedDevice = () => {
  const [device, setDevice] = useState<Nullable<Device>>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErrored] = useState(false);

  const failLoading = () => {
    setLoading(false);
    setErrored(true);
  };

  const loaded = (btDevice: Device) => {
    setDevice(btDevice);
    setLoading(false);
  };

  const forgetDevice = () => {
    if (device) {
      device.disconnect().catch((e) => console.error(e));
      setDevice(null);
    }
  };

  const saveDevice = (btDevice: Device) => {
    DeviceManager.storeDeviceInfo(btDevice.toDeviceDto())
      .then(() => {
        setLoading(true);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    async function doEffect() {
      const result = await DeviceManager.loadDeviceInfo();
      if (result) {
        const btDevice = GenericDevice.fromDeviceDto(result);
        loaded(btDevice);
      } else {
        failLoading();
      }
    }
    if (loading) {
      doEffect().catch(() => {
        failLoading();
      });
    }
  }, [loading]);

  return { loading, error, device, forgetDevice, saveDevice };
};
