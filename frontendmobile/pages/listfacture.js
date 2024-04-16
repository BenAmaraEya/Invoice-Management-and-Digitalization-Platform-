import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute,useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Footer from '../components/Footer';

import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
const ListeFactures = () => {
  const [factures, setFactures] = useState([]);
  const [iderp, setIdErp] = useState(null);
  const route = useRoute();
  const { userId } = route.params;
  const navigation = useNavigation();
  useEffect(() => {
    const fetchFournisseurByUserId = async () => {
      try {
        const response = await axios.get(`http://192.168.0.5:3006/fournisseur/userId/${userId}`);
        const iderpFromResponse = response.data.fournisseur.iderp;
        setIdErp(iderpFromResponse);
      } catch (error) {
        console.error('Error fetching fournisseur:', error);
      }
    };

    fetchFournisseurByUserId();
  }, [userId]);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        if (iderp) {
          const response = await axios.get(`http://192.168.0.5:3006/facture/${iderp}`);
          setFactures(response.data.factures);
        }
      } catch (error) {
        console.error('Error fetching factures:', error);
      }
    };

    fetchFactures();
  }, [iderp]);

  const viewFacturePDF = async (pathpdf) => {
    try {
      const pdfUrl = `http://192.168.0.5:3006/facture/view-pdf/${pathpdf}`;
      const localUri = FileSystem.documentDirectory + 'facture.pdf';
  
      const downloadObject = FileSystem.createDownloadResumable(pdfUrl, localUri, {}, (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        console.log(`Downloading PDF: ${Math.round(progress * 100)}% complete`);
      });
  
      const { uri } = await downloadObject.downloadAsync();
  
      if (Platform.OS === 'web') {
        WebBrowser.openBrowserAsync(uri);
      } else {
        if (Platform.OS === 'ios') {
          const supported = await Linking.canOpenURL(pdfUrl);
          if (supported) {
            await Linking.openURL(pdfUrl);
          } else {
            console.log("Don't know how to open URI: ", pdfUrl);
          }
        } else {
          const supported = await Linking.canOpenURL('file://' + localUri);
          if (supported) {
            await Linking.openURL('file://' + localUri);
          } else {
            console.log("Don't know how to open URI: ", 'file://' + localUri);
          }
        }
      }
    } catch (error) {
      console.error('Error viewing facture PDF:', error);
    }
  };
  
  const deleteFacture = async (iderp, idF) => {
    // Implement delete functionality here
  };

  const renderItem = ({ item }) => (
    <View style={[styles.row, item.status.includes('rejeté') ? styles.rejetedRow : item.status.includes('validé') ? styles.validRow : null]}>
      <View style={styles.cell}>
        <Text style={styles.text}>{item.factname}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.text}>{item.montant}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.text}>{item.status}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.text}>{item.num_po}</Text>
      </View>
      <View style={styles.actionCell}>
        <TouchableOpacity onPress={() => deleteFacture(item.iderp, item.idF)}>
          <Icon name="trash" size={25} color="black" />
        </TouchableOpacity>
        {item.status === 'Attente' || item.status.includes('Manque') ? (
          <TouchableOpacity onPress={() => navigation.navigate('UpdateFacture', { idF: item.idF })}>
            <Icon name="edit" size={25} color="black" />
          </TouchableOpacity>
        ) : null}
      </View>
      <View style={styles.cell}>
        <TouchableOpacity onPress={() => viewFacturePDF(item.pathpdf)}>
          <Icon name="file-pdf-o" size={25} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('UploadFacture')}>
        
        <Text style={styles.addButtonText}><Icon name="plus" size={15} color="white" /> Ajouter Factures</Text>
      </TouchableOpacity>
      <View style={styles.table}>
        <Text style={styles.tableTitle}>List Facture</Text>
        <View style={styles.tableHeader}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Facture Name</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Montant</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Status</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Numéro PO</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Action</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>PDF</Text>
          </View>
        </View>
        <FlatList
          data={factures}
          renderItem={renderItem}
          keyExtractor={(item) => item.idF.toString()}
          style={styles.list}
        />
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    alignSelf: 'flex-end',
    padding: 10,
    marginRight:15,
    backgroundColor: '#a6db86',
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  table: {
    marginBottom: 2,
  },
  tableTitle: {
    fontSize: 20,
    color: '#3b1b0d',
    textAlign: 'center',
    marginBottom:1,
    backgroundColor:'#4367c4'
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fae6c3',
    padding: 1,
    borderRadius: 5,
  },
  rejetedRow: {
    backgroundColor: '#eeb1b1',
    opacity: 0.8,
  },
  validRow: {
    backgroundColor: '#bad381',
    opacity: 0.8,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
    padding: 1,
    backgroundColor: '#e0e6e9',
    borderRadius: 5,
    borderTopWidth: 1,
    borderTopColor: 'white',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  text: {
    textAlign: 'center',
  },
});

export default ListeFactures;