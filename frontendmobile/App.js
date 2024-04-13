import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Layout from './components/Layout';
import { AppRegistry } from 'react-native';

const appName = require('./app.json').name;

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <Layout />
    </>
  );
}

// Register the component correctly
AppRegistry.registerComponent(appName, () => App);
