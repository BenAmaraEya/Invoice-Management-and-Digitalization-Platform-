import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';

const Header = () => {
  const route = useRoute();

  if (route.name === 'Dashboard'||route.name==='Factures'||route.name==='UploadFacture'||route.name==='FormFacture'||route.name==='UpdateFacture') {
    return (
      <View>
        <Text>header</Text>
      </View>
    );
  }

  return null;
};

export default Header;
