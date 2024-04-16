import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../pages/login';
import Dashboard from '../pages/dashboard';
import Header from '../components/Header'; // Import your Header component
import ListeFactures from '../pages/listfacture';
import FactureUploader from '../pages/uploadfacture';

const Stack = createStackNavigator();

const Routers = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{ 
          header: () => <Header />,
         
        }} 
      />
      <Stack.Screen 
        name="Factures" 
        component={ListeFactures} 
        options={{ 
          header: () => <Header />,
         
        }} 
      />
       <Stack.Screen 
        name="UploadFacture" 
        component={FactureUploader} 
        options={{ 
          header: () => <Header />,
         
        }} 
      />
    </Stack.Navigator>
  );
};

export default Routers;
