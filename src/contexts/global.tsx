import React, { createContext, useContext, useReducer } from 'react';
import { Nullable } from '../utils';
import { DeviceDto } from '../devices/device.interface';

interface DeviceDiscoveryState {
  discoveryInProgress: boolean;
  devices: DeviceDto[];
}

interface ConnectedDeviceState {
  loading: boolean;
  device: Nullable<DeviceDto>;
}

export type ActionType =
  | 'startLoading'
  | 'deviceLoaded'
  | 'deviceLoadFailed'
  | 'connectDevice'
  | 'disconnectDevice'
  | 'startDiscovery'
  | 'stopDiscovery'
  | 'enableNotifications'
  | 'disableNotifications';

export interface Action<T> {
  type: ActionType;
  payload: T;
}

export type AnyAction = Action<unknown>;

export interface AppState {
  connectedDevice: ConnectedDeviceState;
  deviceDiscovery: DeviceDiscoveryState;
}

export const reducer = (state: AppState, action: AnyAction): AppState => {
  switch (action.type) {
    case 'startLoading':
      return {
        ...state,
        connectedDevice: {
          ...state.connectedDevice,
          loading: true,
        },
      };
    case 'deviceLoadFailed':
      return {
        ...state,
        connectedDevice: {
          device: null,
          loading: false,
        },
      };
    case 'deviceLoaded':
      const deviceDto = action.payload as DeviceDto;
      return {
        ...state,
        connectedDevice: {
          device: { ...deviceDto },
          loading: false,
        },
      };
    case 'startDiscovery':
      return {
        ...state,
        deviceDiscovery: {
          ...state.deviceDiscovery,
          discoveryInProgress: true,
        },
      };
    case 'stopDiscovery':
      return {
        ...state,
        deviceDiscovery: {
          ...state.deviceDiscovery,
          discoveryInProgress: false,
        },
      };
    default:
      return {
        ...state,
      };
  }
};

export const initialState = {
  connectedDevice: {
    loading: true,
    device: null,
  },
  deviceDiscovery: {
    discoveryInProgress: false,
    devices: [],
  },
} as AppState;

type UseReducerReturnType = [AppState, React.Dispatch<AnyAction>];

export const StateContext = createContext<UseReducerReturnType>([
  initialState,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
]);

type StateProviderProps = {
  reducer: typeof reducer;
  initialState: AppState;
  children: React.ReactNode;
};

export const StateProvider = (props: StateProviderProps) => (
  <StateContext.Provider value={useReducer(props.reducer, props.initialState)}>
    {props.children}
  </StateContext.Provider>
);

export const useGlobals = () => useContext(StateContext);
