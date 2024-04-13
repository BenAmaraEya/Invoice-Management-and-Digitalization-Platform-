import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';

const Dashboard = () => {
  const [iderp, setIderp] = useState(null);
  const [factureCounts, setFactureCounts] = useState({
    NBFValide: 0,
    NBFpaye: 0,
    NBFAttente: 0,
    NBFrejete: 0,
  });

  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    const fetchFournisseurById = async () => {
      try {
        const response = await axios.get(`http://localhost:3006/fournisseur/userId/${id}`);
        const iderpFromResponse = response.data.fournisseur.iderp;
        setIderp(iderpFromResponse);
      } catch (error) {
        console.error('Error fetching fournisseur:', error);
      }
    };

    fetchFournisseurById();
  }, [id]);

  useEffect(() => {
    const fetchFactureCounts = async () => {
      try {
        if (iderp) {
          const response = await axios.get(`http://localhost:3006/facture/status/${iderp}`);
          const { NBFValide, NBFpaye, NBFAttente, NBFrejete } = response.data;
          setFactureCounts({ NBFValide, NBFpaye, NBFAttente, NBFrejete });
        }
      } catch (error) {
        console.error('Error fetching facture counts:', error);
      }
    };

    fetchFactureCounts();
  }, [iderp]);

  const options = {
    chart: {
      type: 'pie',
      width: 500,
    },
    colors: ['#fae6c3', '#bad381', '#4367c4', '#eeb1b1'],
    labels: ['Validé', 'Payé', 'En Attente', 'Rejeté'],
  };

  const series = [factureCounts.NBFValide, factureCounts.NBFpaye, factureCounts.NBFAttente, factureCounts.NBFrejete];

  return (
    <View style={styles.dashboardContainer}>
      <Text style={styles.title}>Tableau de bord</Text>
      <View style={styles.chartContainer}>
        <Chart options={options} series={series} type="pie" width={380} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
  },
});

export default Dashboard;
