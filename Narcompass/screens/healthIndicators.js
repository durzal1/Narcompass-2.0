import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    Switch,
} from 'react-native';

const SECTIONS = [
    {
        header: 'Health Indicators',
        items: [
            { id: 'age', icon: 'cake', label: 'Age', type: 'info' },
            { id: 'height', icon: 'arrow-up', label: 'Height', type: 'info' },
            { id: 'weight', icon: 'weight', label: 'Weight', type: 'info' },
            { id: 'sex', icon: 'gender', label: 'Sex', type: 'info' },
            { id: 'bmp', icon: 'heartbeat', label: 'BMP', type: 'indicator' },
            { id: 'o2Levels', icon: 'lungs', label: 'O2 Levels', type: 'indicator' },
            // Add other health indicators as needed
        ],
    },
];




export default function HealthIndicators() {
    const healthDataArray = [98, 80, 15, 66, 1, 171, 59.7, 20.4]; // will pull from smartwatch, but for demo purposes data is here


    const [healthInfo, setHealthInfo] = useState({
        o2_percent: healthDataArray[0],
        beatsPerMin: healthDataArray[1],
        breathsPerMin: healthDataArray[2],
        sex: healthDataArray[3] ? "Male" : "Female",
        height_cm: healthDataArray[4],
        weight_kg: healthDataArray[5],
        bmi: healthDataArray[6],
    });

    const [healthStatus, setHealthStatus] = useState("Healthy");
    useEffect(() => {
        (async () => {

            await fetch(`https://5h4fv0ryd5.execute-api.us-east-1.amazonaws.com/default/getHealthStatus?inputData=${healthDataArray.join(',')}`) 
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setHealthStatus(data.result === "1" ? "Healthy" : "Not Healthy")
                }
                )
                .catch(error => console.error('Error calling API:', error));

        })();



    })


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Health Indicators</Text>

                    <Text style={styles.subtitle}>
                        Monitor Your Health Status!
                    </Text>
                </View>

                <View style={styles.profile}>
                    {/* ... */}
                    <Text style={styles.profileAge}>Age: {healthInfo.age}</Text>
                    <Text style={styles.profileHeight}>Height: {healthInfo.height} cm</Text>
                    <Text style={styles.profileWeight}>Weight: {healthInfo.weight} kg</Text>
                    <Text style={styles.profileSex}>Sex: {healthInfo.sex}</Text>
                </View>

                {SECTIONS.map(({ header, items }) => (
                    <View style={styles.section} key={header}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>{header}</Text>
                        </View>
                        <View style={styles.sectionBody}>
                            {items.map(({ id, label, icon, type, value }, index) => {
                                return (
                                    <View
                                        key={id}
                                        style={[
                                            styles.rowWrapper,
                                            index === 0 && { borderTopWidth: 0 },
                                        ]}>
                                        {/* ... */}
                                        {type === 'indicator' && (
                                            <Text style={styles.rowValue}>{label + ": " + healthInfo[id]}</Text>
                                        )}
                                        {/* ... */}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                ))}
                <Text style={styles.rowValue}>
                    Health Status: <Text style={healthStatus === "Healthy" ? styles.healthStatusText : styles.healthStatusTextBad}>{healthStatus}</Text>
                </Text>

                {/* Add a button to trigger the model loading */}

            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#3498db',
        padding: 10,
        marginTop: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    container: {
        backgroundColor: '#131c25',
        flex: 1,
        paddingTop: 30,
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    header: {
        paddingLeft: 24,
        paddingRight: 24,
        marginBottom: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#8491a1',
    },
    profile: {
        padding: 16,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#2b3849',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#8491a1',
    },
    profileAge: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    profileHeight: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    profileWeight: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    profileSex: {
        marginTop: 6,
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    rowWrapper: {
        paddingLeft: 24,
        backgroundColor: '#2b3849',
        borderTopWidth: 1,
        borderColor: '#8491a1',
    },
    rowLabel: {
        fontSize: 17,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    rowValue: {
        fontSize: 17,
        color: '#8491a1',
        marginRight: 4,
    },
    healthStatusText: {
        color: '#00cc66', // or any color that represents a healthy status
        fontWeight: 'bold',
    },
    healthStatusTextBad: {
        color: '#ff0000', // or any color that represents a healthy status
        fontWeight: 'bold',
    },
});
