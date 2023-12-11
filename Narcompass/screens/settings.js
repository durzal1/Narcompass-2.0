import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Settings() {
    const [narcanCarrier, setNarcanCarrier] = useState(false);
    const [radius, setRadius] = useState('1');
    const [transportationMode, setTransportationMode] = useState('Car');

    const radiusOptions = ['1 mile', '3 miles', '5 miles', '10 miles', '10+ miles'];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <View style={styles.optionContainer}>
                <View style={styles.option}>
                    <Text>Narcan Carrier</Text>
                    <Switch
                        value={narcanCarrier}
                        onValueChange={(value) => setNarcanCarrier(value)}
                    />
                </View>
                <View style={styles.option}>
                    <Text>Radius to Help</Text>
                    <Picker
                        selectedValue={10}
                        style={ styles.pickerStyles }
                        onValueChange={(itemValue) => setRadius(itemValue)}>
                        {/*<Picker.Item label="1" value="pikachu" />*/}
                        <Picker.Item label="3" value="3" />

                        {/*{radiusOptions.map((option, index) => (*/}
                        {/*    <Picker.Item key={index} label={option} value={(index + 1).toString()} />*/}
                        {/*))}*/}
                    </Picker>
                </View>
                <View style={styles.option}>
                    <Text>Mode of Transportation</Text>
                    <Picker
                        selectedValue={transportationMode}
                        style={{ height: 50, width: 150 }}
                        onValueChange={(itemValue) => setTransportationMode(itemValue)}
                    >
                        <Picker.Item label="Car" value="Car" />
                        <Picker.Item label="Walking" value="Walking" />
                        <Picker.Item label="Bike" value="Bike" />
                    </Picker>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    optionContainer: {
        width: '100%',
    },
    option: {
        color:'black',

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        // backgroundColor: '#fff',
        // backgroundColor:'gray',

    },

    pickerStyles:{
        width:'70%',
        // backgroundColor:'blue',
        color: 'red', // Add this line
    }
});
