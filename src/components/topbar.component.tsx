import * as React from 'react';
import { Appbar, useTheme } from 'react-native-paper';
//import { StyleSheet } from 'react-native';

const TopBar = () => {
  const theme = useTheme();

  return (
    <Appbar.Header style={[{ backgroundColor: theme.colors.elevation.level2 }]}>
      <Appbar.Content title="Raid Alerts" />
    </Appbar.Header>
  );
};

export default TopBar;
