import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../components/Footer';

const ReclamationForm = () => {
  const [contenu, setContenu] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [iderp, setIdErp] = useState('');
  const AdresseIp='172.20.10.6'//'192.168.0.5'
  useEffect(() => {
    const fetchFournisseurByUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        const response = await axios.get(`http://${AdresseIp}:3006/fournisseur/userId/${id}`);
        const iderp = response.data.fournisseur.iderp;
        setIdErp(iderp);
      } catch (error) {
        console.error('Error fetching fournisseur:', error);
      }
    };

    fetchFournisseurByUserId();
  }, []);

  const handleSubmit = async () => {
    try {
      if (iderp) {
        const response = await axios.post(`http://${AdresseIp}:3006/reclamation/envoyer/${iderp}`, { contenu });
        console.log(response.data); 
       
        setContenu('');
        setErrorMessage('');
        
        Alert.alert('Success', 'Réclamation envoyée avec succès');
      }
      
    } catch (error) {
      console.error('Error sending reclamation:', error);
      setErrorMessage('Erreur lors de l\'envoi de la réclamation');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Envoyer une réclamation</Text>
        <TextInput
          style={styles.input}
          placeholder="Contenu de la réclamation"
          multiline={true}
          value={contenu}
          onChangeText={text => setContenu(text)}
        />
        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Envoyer</Text>
        </TouchableOpacity>
        <Footer/>
      </View>
     
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default ReclamationForm;
