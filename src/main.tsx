import * as React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import App from './App';
import { name as appName } from '../app.json';
import messaging from '@react-native-firebase/messaging';
import { backgroundTask } from './background';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StateProvider, initialState, reducer } from './contexts/global';

export default function Main() {
  return (
    <PaperProvider
      settings={{
        icon: (props) => <Icon {...props} />,
      }}
    >
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    </PaperProvider>
  );
}

export const main = () => {
  console.log('Started main()');
  messaging().setBackgroundMessageHandler(backgroundTask);
  console.log('Background message handler is set');
  console.log('Register UI components');
  AppRegistry.registerComponent(appName, () => Main);
  console.log('Done UI components registration');
};
