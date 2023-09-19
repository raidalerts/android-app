import * as React from 'react';
import { AppRegistry } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import App from './App';
import { name as appName } from '../app.json';
import messaging from '@react-native-firebase/messaging';
import { backgroundTask } from './background';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StateProvider, initialState, reducer } from './contexts/global';
//import OldApp from './OldApp';

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
  messaging()
    .subscribeToTopic('raidalerts')
    .then(() => console.log('Subscribed to topic!'));

  // Register background handler
  messaging().setBackgroundMessageHandler(backgroundTask);

  AppRegistry.registerComponent(appName, () => Main);
};
