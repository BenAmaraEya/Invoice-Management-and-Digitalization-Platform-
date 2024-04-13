import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Header from '../components/Header'; // Import your Header component
import Footer from '../components/Footer'; // Import your Footer component
import Routers from '../routes/routes';

const Layout = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Header />
        <Routers />
        <Footer />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default Layout;
