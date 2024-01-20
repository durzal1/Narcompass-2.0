import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, TextInput, Image } from 'react-native';

import heart from "../assets/images/heart.png"

const SECTIONS = [
    {
        header: 'Health Indicators',
        items: [
            { id: 'O2', label: 'O2 Level (%)', type: 'indicator' },
            { id: 'heart_rate', label: 'Beats Per Min', type: 'indicator' },
            { id: 'bpm', label: 'Breaths Per Min', type: 'indicator' },
            { id: 'age', label: 'Age', type: 'info' },
            { id: 'sex', label: 'Sex', type: 'info' },
            { id: 'height', label: 'Height (cm)', type: 'info' },
            { id: 'weight', label: 'Weight (kg)', type: 'info' },
            { id: 'bmi', label: 'BMI', type: 'info' },
        ],
    },
];

export default function HealthIndicators() {
    const initalHealthData = [98, 80, 15, 66, 1, 171, 59.7, 20.4];

    const [healthInfo, setHealthInfo] = useState({
        O2: initalHealthData[0],
        heart_rate: initalHealthData[1],
        bpm: initalHealthData[2],
        age: initalHealthData[3],
        sex: initalHealthData[4] === 1 ? 'Male' : 'Female',
        height: initalHealthData[5],
        weight: initalHealthData[6],
        bmi: initalHealthData[7],
    });

    const [healthStatus, setHealthStatus] = useState('Healthy');


    const updateHealthInfo = async (id, newValue) => {
        console.error(id + " " + newValue)
        let tempInfo = JSON.parse(JSON.stringify(healthInfo))
        tempInfo[id] = id === "sex" ? newValue : parseInt(newValue)
        // Check if the value is NaN and set it to an empty string
        if (isNaN(tempInfo[id])) {
            tempInfo[id] = '';
        }
        setHealthInfo(tempInfo);
        console.log("HERE")

        let healthArr = Object.values(tempInfo)
        healthArr[4] = (healthArr[4] === 'Male') ? 1 : -1;
        console.log("HERE")

        console.error(healthArr)
        await fetch(`https://5h4fv0ryd5.execute-api.us-east-1.amazonaws.com/default/getHealthStatus?inputData=${healthArr.join(',')}`)
            .then(response => response.json())
            .then(data => {
                console.error(data)
                setHealthStatus(data.result === "1" ? "Healthy" : "Not Healthy")
            }
            )
            .catch(error => console.error('Error calling API:', error));





        console.log("healthStatus")
        console.log(healthInfo)
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Health Information</Text>
                <View style={styles.horizontalLine} />
            </View>

            <View style={styles.heartSection}>
                <Image source={heart} style={styles.centeredHeartImage} />
            </View>

            <View style={styles.infoGrid}>
                {SECTIONS.map((section) => (
                    <React.Fragment key={section.header}>
                        {section.items.map((item) => (
                            <View style={styles.infoItem} key={item.id}>
                                <Text style={styles.infoLabel}>{item.label}</Text>

                                <TextInput
                                    style={styles.infoValue}
                                    value={String(healthInfo[item.id])}
                                    onChangeText={(text) => updateHealthInfo(item.id, text)}
                                    keyboardType={item.id === 'sex' ? 'default' : 'numeric'}

                                />

                            </View>
                        ))}
                    </React.Fragment>
                ))}
            </View>

            <Text style={styles.healthStatus}>
                Health Status: {' '}
                <Text style={healthStatus === 'Healthy' ? styles.healthyText : styles.unhealthyText}>
                    {healthStatus}
                </Text>
            </Text>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({

    infoItem: {
        flexBasis: '48%', // Adjusted to smaller size, you can further reduce it
        backgroundColor: '#34495e',
        padding: 15, // Reduced padding for a smaller box
        borderRadius: 12, // Slightly reduced border radius
        marginBottom: 15, // Reduced margin
        alignItems: 'center',
    },

    infoLabel: {
        fontSize: 18, // Slightly reduced font size
        color: '#ecf0f1',
        fontWeight: 'bold',
    },

    infoValue: {
        fontSize: 20, // Adjusted font size
        fontWeight: 'bold',
        color: '#bdc3c7',
    },

    container: {
        flex: 1,
        backgroundColor: '#192734', // Dark blue background
    },
    headerContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    headerText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff', // Emerald green text
    },
    centeredHeartImage: {
        width: 300,
        height: 300,
        marginTop: -100,
        marginBottom: -70,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 20,
    },

    healthStatus: {
        fontSize: 24, // Increased font size
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ecf0f1',
        textAlign: 'center', // Center the text
        marginTop: -20
    },
    healthyText: {
        color: '#2ecc71', // Emerald green text for healthy status
    },
    unhealthyText: {
        color: '#e74c3c', // Alizarin red text for unhealthy status
    },




    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 20,
    },

    gridItem: {
        flexBasis: '30%', // Adjust for 3 columns with some space in between
        backgroundColor: '#222',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },

    scrollViewContainer: {
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
    },
    profile: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    profileText: {
        fontSize: 16,
        marginBottom: 8,
    },
    sectionContainer: {
        marginBottom: 20,
    },

    heartSection: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    heartImage: {
        width: 100,
        height: 100,
    },

    heartRateText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },


    horizontalLine: {
        width: 170,
        height: 1,
        backgroundColor: '#fff', // White line
        marginTop: 10,
    },
    sectionHeader: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 8,
        marginBottom: 8,
    },
    sectionHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    indicatorContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
    },
    indicatorItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    firstItem: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    indicatorLabel: {
        fontSize: 16,
    },
    indicatorValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    button: {
        backgroundColor: '#3498db',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

