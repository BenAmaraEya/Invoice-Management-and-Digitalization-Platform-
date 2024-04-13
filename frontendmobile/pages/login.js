import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleInputChange = (text, field) => {
    setCredentials({
      ...credentials,
      [field]: text,
    });
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3006/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const { token, id, profil } = data;

      AsyncStorage.setItem('accessToken', token);
      AsyncStorage.setItem('userId', id.toString());
      AsyncStorage.setItem('userProfil', profil);

      navigation.navigate('Dashboard', { id });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <TextInput
          style={styles.input}
          placeholder="Entez votre nom"
          value={credentials.username}
          onChangeText={(text) => handleInputChange(text, 'username')}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Votre mot de passe"
          value={credentials.password}
          onChangeText={(text) => handleInputChange(text, 'password')}
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});

export default Login;
