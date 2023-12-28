import React from 'react';
import {FlatList, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import { Text } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const data2 = [
    {
        location: 'New York',
        time: '1:30 PM',
        distance: '30 Miles',
        emergency_contact_info: '215-581-5032',
        assigned_unit: 'test',
        current_status: 'Active',
        ID: 1,
    },
    // Add more data objects if needed
];

const keyImageMapping = {
    time: require('../assets/images/time5.png'),
    location: require('../assets/images/location2.png'),
    assigned_unit: require('../assets/images/unit1.png'),
    distance: require('../assets/images/distance1.png'),
    emergency_contact_info: require('../assets/images/phone.png'),
    current_status: require('../assets/images/status.png'),
};

// Custom labels for each key
const keyTextLabelMapping = {
    ID: 'Emergency ID',
    time: 'Time Emergency Received',
    location: 'Location Of Emergency',
    assigned_unit: 'Assigned Unit',
    distance: 'Distance to Victim',
    emergency_contact_info: 'Victim Phone Number',
    current_status: 'Current Status Of Emergency',
};
export default function Active({ route }) {
    const navigation = useNavigation();
    const data  = [route.params.itemData]; // Assuming you pass the data as 'items' through navigation
    console.log(data)
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={104} color="#FFFFFF" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const renderItem = ({ item }) => (

        <View style={styles.container}>
            <View style={styles.separator} />

            {Object.entries(item).map(([key, value]) => {
                if (key === 'ID') {
                    return null; // Skip rendering for 'ID' key
                }
                let renderedValue = value;
                if (key === 'time') {
                    // Format 'time' if the key matches
                    renderedValue = new Date(value).toLocaleTimeString();
                    console.log(renderedValue)
                }
                return (
                    <View key={key} style={styles.historyBox}>
                        <View style={styles.innerBox}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={keyImageMapping[key]}
                                    style={styles.defaultImage}
                                />
                            </View>
                            <View style={styles.verticalLine}></View>

                            <View style={styles.textContainer}>
                                <Text style={[styles.text, styles.titleText]}>{keyTextLabelMapping[key]}</Text>
                                <Text style={[styles.text, styles.contentText]}>
                                    {typeof renderedValue === 'number' ? value : `${renderedValue}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.ID.toString()}
            style={styles.container2}
        />
    );
}

const styles = StyleSheet.create({
    backButton: {
        marginLeft: 10,
        padding: 5,
        color: 'white',
    },
    separator: {
        marginVertical: 40,
        height: 3,
        backgroundColor: '#131c25',
    },
    container: {
        backgroundColor: '#131c25',
        paddingHorizontal: 20,
    },
    container2: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#131c25',
    },
    historyBox: {
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: '#2b3849',
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    innerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    imageContainer: {
        marginRight: 10,
    },
    largerImage: {
        width: 50,
        height: 50,
        borderRadius: 20,
    },
    defaultImage: {
        width: 50,
        height: 50,
        borderRadius: 20,
    },
    textContainer: {
        flex: 1,
    },
    text: {
        color: '#e2e8f0',
        fontFamily: 'Roboto', // Replace with your desired font family
        lineHeight: 24,
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 6,
    },
    contentText: {
        fontSize: 16,
        color: '#8491a1',
    },
    verticalLine: {
        height: '100%',
        width: 1,
        backgroundColor: 'white',
        marginHorizontal: 12,
        opacity: 0.5,
    },
});
