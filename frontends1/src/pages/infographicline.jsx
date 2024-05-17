import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Chart from 'react-apexcharts';

const InfographicLine = () => {
    const { idF } = useParams();
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: 'line',
                height: 50,
                zoom: {
                    enabled: true,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: 'straight', // Straight line
                width: 3, // Adjust the line width as needed
            },
            yaxis: {
                min: 0,
                max: 2, // Adjust the y-axis range as needed
                labels: {
                    show: false, // Hide y-axis labels
                },
            },
            tooltip: {
                enabled: false, // Disable tooltip
            },
            grid: {
                show: false, // Hide grid
            },
            xaxis: {
                categories: [0],
            },
        },
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchEtat = async () => {
            if (!idF) {
                console.error('No idF provided');
                setError('No idF provided');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching etat for idF:', idF);
                const response = await axios.get(`http://localhost:3006/etat/etatFacture/${idF}`);
                console.log('Response data:', response.data);
                const data = response.data;
                if (Array.isArray(data)) {
                    const filteredData = data.filter(item => {
                        console.log('Item:', item);
                        return (
                            item.etat === 'Attente' ||
                            item.etat === 'Envoye Finanace' ||
                            item.etat === 'Envoye Fiscalité' ||
                            item.etat === 'paiement' ||
                            item.etat === 'cloture'
                        );
                    });
                    const categories = filteredData.map(item => item.date); // Adjust according to your data structure
                    const values = filteredData.map(item => item.etat); // Adjust according to your data structure

                    const completedSteps = [0, 2, 4]; // Example indices of completed steps
                    const fill = {
                        type: 'gradient',
                        gradient: {
                            shade: 'light',
                            shadeIntensity: 0.4,
                            inverseColors: false,
                            opacityFrom: 0.8,
                            opacityTo: 0.2,
                            stops: []
                        }
                    };

                    // Calculate stops based on completed steps
                    const totalSteps = values.length - 1;
                    completedSteps.forEach(stepIndex => {
                        fill.gradient.stops.push(stepIndex / totalSteps);
                    });

                    setChartData({
                        series: [
                            {
                                name: 'Etat',
                                data: values,
                                fill: fill
                            },
                        ],
                        options: {
                            ...chartData.options,
                            xaxis: {
                                categories: values,
                            },
                        },
                    });
                } else {
                    console.error('Unexpected data format:', data);
                    setError('Unexpected data format');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching etat:', error);
                setError('Error fetching etat. Please try again later.');
                setLoading(false);
            }
        };

        fetchEtat();
    }, [idF]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Etat for Facture ID: {idF}</h2>
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={350}
            />
        </div>
    );
};

export default InfographicLine;
