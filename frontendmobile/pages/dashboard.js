import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Footer from '../components/Footer';

const Dashboard = () => {
  const [iderp, setIderp] = useState(null);
  const [factureCounts, setFactureCounts] = useState({
    NBFValide: 0,
    NBFpaye: 0,
    NBFAttente: 0,
    NBFrejete: 0,
  });

  const route = useRoute();
  const { userId } = route.params;  // change this line to get userId from params

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchFournisseurById = async () => {
      try {
        const response = await axios.get(`http://localhost:3006/fournisseur/userId/${userId}`); // change this line
        const iderpFromResponse = response.data.fournisseur.iderp;
        setIderp(iderpFromResponse);
      } catch (error) {
        console.error('Error fetching fournisseur:', error);
      }
    };

    fetchFournisseurById();
  }, [userId]);  // change this line

  useEffect(() => {
    const fetchFactureCounts = async () => {
      try {
        if (iderp) {
          const response = await axios.get(`http://localhost:3006/facture/status/${iderp}`);
          const { NBFValide, NBFpaye, NBFAttente, NBFrejete } = response.data;
          setFactureCounts({ NBFValide, NBFpaye, NBFAttente, NBFrejete });
          setChartData([
            {
              name: 'Validé',
              population: NBFValide,
              color: '#fae6c3',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: 'Payé',
              population: NBFpaye,
              color: '#bad381',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: 'Attente',
              population: NBFAttente,
              color: '#4367c4',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: 'Rejeté',
              population: NBFrejete,
              color: '#d1c2d9',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching facture counts:', error);
      }
    };

    fetchFactureCounts();
  }, [iderp]);

  return (
    <View style={styles.dashboardContainer}>
      <Text style={styles.title}>Tableau de bord</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={380}
          height={220}
          chartConfig={{
            backgroundColor: '#f5f5f5',
            backgroundGradientFrom: '#f5f5f5',
            backgroundGradientTo: '#f5f5f5',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
      <Footer />
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
