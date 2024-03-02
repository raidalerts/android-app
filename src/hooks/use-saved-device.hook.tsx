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
    (async () => {
      if (device) {
        await device.disconnect();
        await DeviceManager.clearDeviceInfo();
        setDevice(null);
      }
    })()
      .then(() => {
        // do nothing
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const saveDevice = (btDevice: Device, showLoading = true) => {
    DeviceManager.storeDeviceInfo(btDevice.toDeviceDto())
      .then(() => {
        setLoading(showLoading);
      })
      .catch((e) => console.error(e));
  };

  const setDeviceMuted = (muted: boolean) => {
    if (device) {
      device.setMuted(muted);
      saveDevice(device);
    }
  };

  useEffect(() => {
    async function doEffect() {
      const result = await DeviceManager.loadDeviceInfo();
      console.log('Loaded device info', result);
      if (result) {
        const btDevice = GenericDevice.fromDeviceDto(result);
        console.log('Connecting to device', btDevice);
        await btDevice.connect();
        loaded(btDevice);
      } else {
        failLoading();
      }
    }
    if (loading) {
      doEffect().catch((e) => {
        console.error(e);
        failLoading();
      });
    }
  }, [loading]);

  return { loading, error, device, forgetDevice, saveDevice, setDeviceMuted };
};
