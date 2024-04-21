import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Picker, CheckBox } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import MultiSelect from 'react-native-multiple-select';

const UpdateFacture = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { idF } = route.params;
  const piecesJointesOptions = [
    { id: 1, piece_name: 'PV DE RÉCEPTION' },
    { id: 2, piece_name: 'BON DE COMMANDE' },
    { id: 3, piece_name: 'BON DE LIVRAISON' },
    { id: 4, piece_name: 'COPIE DE CONTRAT' },
    { id: 5, piece_name: 'APPEL À LA FACTURATION' },
    { id: 6, piece_name: 'RELEVÉ CONSOMMATION' },
    { id: 7, piece_name: 'CIN' },
  ];
  const [formData, setFormData] = useState({
    num_fact: '',
    num_po: '',
    date_fact: new Date(),
    montant: '',
    factname: '',
    devise: 'TND',
    nature: '',
    objet: '',
    datereception: '',
    pathpdf: '',
    idfiscale: '',
    fournisseur: '',
    delai_paiement: new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    piece_name: [],
  });
  const [fileUri, setFileUri] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedPieces, setSelectedPieces] = useState([]);

  const handlePieceSelection = (pieces) => {
    setSelectedPieces(pieces);
  };
  useEffect(() => {
    const fetchFactureDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:3006/facture/facturebyId/${idF}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedFacture = response.data.facture;
        console.log(fetchedFacture);
        if (fetchedFacture) {
          setFormData(prevData => ({
            ...prevData,
            num_fact: fetchedFacture.num_fact || '',
            num_po: fetchedFacture.num_po || '',
            date_fact: fetchedFacture.date_fact ? new Date(fetchedFacture.date_fact) : new Date(),
            montant: fetchedFacture.montant ? String(fetchedFacture.montant) : '',
            factname: fetchedFacture.factname || '',
            devise: fetchedFacture.devise || 'TND',
            nature: fetchedFacture.nature || '',
            objet: fetchedFacture.objet || '',
            datereception: fetchedFacture.datereception || '',
            pathpdf: fetchedFacture.pathpdf || '',
            piece_name: fetchedFacture.Pieces_jointes.map(piece => piece.piece_name) || [],
            idfiscale: fetchedFacture.idfiscale || '',
            fournisseur: fetchedFacture.fournisseur || '',
          }));
        } else {
          console.error('Facture data not found in response');
        }
      } catch (error) {
        console.error('Error fetching facture details:', error);
      }
    };

    fetchFactureDetails();
  }, [idF]);

  const handleChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date_fact;
    setFormData(prevData => ({
      ...prevData,
      date_fact: currentDate,
    }));
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
  
      if (res.type === 'cancel') {
        console.log('User cancelled the file picking');
        return;
      }
  
      handleFileInput(res.uri, res.name);
    } catch (err) {
      console.error('Error picking the file:', err);
    }
  };

  const handleFileInput = (uri, name) => {
    setFileUri(uri);
    setFileName(name);
  };

  const changeDocuments = async () => {
    try {
      if (!fileUri) {
        Alert.alert('Error', 'Please select a PDF file');
        return;
      }

      const formData = new FormData();
      formData.append('factureFile', {
        uri: fileUri,
        name: fileName,
        type: 'application/pdf',
      });

      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:3006/facture/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const extractedInfo = response.data.extractedInfo;
      const filePath = `uploads/${fileName}`;

      setFormData(prevData => ({
        ...prevData,
        num_fact: extractedInfo.num_fact || fetchedFacture.num_fact || '',
        date_fact: extractedInfo.date_fact ||fetchedFacture.date_fact || '',
        montant: extractedInfo.montant || fetchedFacture.montant ||'',
      }));

      console.log('Facture data updated successfully.');
      alert('Facture data updated successfully.');
    } catch (error) {
      console.error('Error uploading facture:', error);
      alert('Failed to update facture.');
    }
  };

  const handleSubmit = async () => {
    try {
      // Vérifier que piece_name est renseigné
      if (selectedPieces.length === 0) {
        Alert.alert('Erreur', 'Veuillez sélectionner au moins une pièce jointe.');
        return;
      }
  
      const token = await AsyncStorage.getItem('accessToken');
      const updatedFormData = {
        piece_name: selectedPieces.map(piece => piece.piece_name),
        
      };
      console.log("aaaa",updatedFormData.piece_name)
      // Update facture
      const updateFactureResponse = await axios.put(`http://localhost:3006/facture/updateFacture/${idF}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update pieces jointes
      const updatePiecesResponse = await axios.put(`http://localhost:3006/piecejoint/updatepiece/${idF}`, {
        piece_name: updatedFormData.piece_name, // Envoyer uniquement les noms des pièces jointes
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log('Facture et pièces jointes mises à jour avec succès.');
      alert('Facture et pièces jointes mises à jour avec succès.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la facture ou des pièces jointes:', error);
      alert('Échec de la mise à jour de la facture ou des pièces jointes.');
    }
  };
  
  
  
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Modifier Facture</Text>
        <View style={styles.factureForm}>
          <View style={styles.formGroup}>
            <Text style={styles.factureLabel}>Numéro de Facture:</Text>
            <TextInput
              style={styles.factureInput}
              value={formData.num_fact}
              onChangeText={(value) => handleChange('num_fact', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.factureLabel}>Numéro PO:</Text>
            <TextInput
              style={styles.factureInput}
              value={formData.num_po}
              onChangeText={(value) => handleChange('num_po', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.factureLabel}>Date de Facture:</Text>
            <DateTimePicker
              value={formData.date_fact}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.factureLabel}>Montant:</Text>
            <TextInput
              style={styles.factureInput}
              value={formData.montant}
              onChangeText={(value) => handleChange('montant', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.factureLabel}>Nom de Facture:</Text>
            <TextInput
              style={styles.factureInput}
              value={formData.factname}
              onChangeText={(value) => handleChange('factname', value)}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.factureLabel}>Devise:</Text>
            <TextInput
              style={styles.factureInput}
              value={formData.devise}
              onChangeText={(value) => handleChange('devise', value)}
            />
          </View>
        <View style={styles.formGroup}>
            <Text style={styles.factureLabel}>Pièces Jointes :</Text>
            <MultiSelect
              items={piecesJointesOptions}
              uniqueKey="id"
              onSelectedItemsChange={handlePieceSelection}
              selectedItems={selectedPieces}
              selectText="Sélectionner"
              searchInputPlaceholderText="Rechercher..."
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="piece_name"
              searchInputStyle={{ color: '#CCC' }}
              submitButtonColor="#CCC"
              submitButtonText="Choisir"
            />
          </View>


   

          <TouchableOpacity style={styles.uploadBtn} onPress={pickFile}>
  <Text>Choisir un Fichier PDF</Text>
</TouchableOpacity>
        <TouchableOpacity style={styles.validerFormBtn} onPress={changeDocuments}>
          <Text>Modifier Document</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.validerFormBtn} onPress={handleSubmit}>
          <Text>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  uploadBtn: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  validerFormBtn: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default UpdateFacture;
