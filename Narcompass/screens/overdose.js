import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import narcanImage from "../assets/images/narcan2PNG.png";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getDistance, locationData, reverseGeocode } from "./map";
import { getLocation, getOverdose } from "../src/dbFunctions";
import { _ID, client } from "../App";

// Function to format phone numbers in a readable format
const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
};
 
export default function Overdose() {
    const navigation = useNavigation();
    const [overdoseBoxes, setOverdoseBoxes] = useState([]);

    const handleInfoClick = (itemData) => {
        navigation.navigate('ActiveDetails', { itemData });
    };

    useEffect(() => {
        (async () => {
            const overdoseData = [];

            for (const location of locationData) {
                if (location.id === undefined || location.id === _ID) continue; // if an overdose does not exist or if it is your own reporting, ignore
                console.error(locationData)
                // Fetch overdose information for given user
                let cur = await getOverdose(client, { id: location.id });

                if (cur === null) continue;

                let { id, helper_ids, timestamp, active } = cur;

                // Get latitude and longitude
                let { longitude, latitude } = await getLocation(client,  { id: id });
 
                // Add data to list to display
                overdoseData.push({
                    ID: id,
                    time: timestamp,  
                    location: await reverseGeocode(latitude, longitude),
                    distance: getDistance(longitude, latitude),
                    emergency_contact_info: formatPhoneNumber(id),
                    assigned_unit: `${helper_ids.length} units active`,
                    current_status: active ? 'Active' : 'Not active'
                });
            }

            // Set the formatted data in the state
            setOverdoseBoxes(mapOverdoseData(overdoseData));
        })();
    }, []);

    // Map overdose overdose data to JSX elements
    function mapOverdoseData(data) {
        return data.map((item, index) => (
            <View key={index} style={styles.overdoseBox}>
                <View style={styles.innerBox}>
                    <View style={styles.circle}>
                        <Image source={narcanImage} style={styles.image} />
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.locationText}>
                            {item.location}
                        </Text>
                        <Text style={styles.timeText}>
                            {new Date(item.time).toLocaleTimeString()}
                        </Text>
                    </View>
                    <View style={styles.infoCircle}>
                        {/* Information symbol */}
                        <TouchableOpacity onPress={() => handleInfoClick(item)}>
                            <MaterialIcons name="info" size={40} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        ));
    }

    return ( 
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Recent Overdoses</Text>
            </View>
            <View style={styles.separator} /> 
            <FlatList data={overdoseBoxes} renderItem={({ item }) => item} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#131c25',
        flex: 1,
        paddingTop: 30, // Add top padding for space
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center', // Align title in the center
        alignItems: 'center',
        marginVertical: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'System',
        textAlign: 'center', // Center the text within the container
        flex: 1, // Allow the text to take up available space
    },
    count: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'System',
        marginLeft: 10,
    },

    text: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'center',
        color: "#FFFFFF",
        fontFamily: 'System',

    },
    locationText: {
        fontSize: 18, // Increase font size for location
        fontWeight: "bold",
        color: "#FFFFFF",
        fontFamily: 'System',
    },
    timeText: {
        fontSize: 14,
        color: "#8491a1", // Use a lighter color for timestamp
        fontFamily: 'System',
    },
    separator: {
        marginVertical: 15, // Increase vertical space
        height: 1, // Make the line thinner
        backgroundColor: '#8491a1', // Adjust color for subtle contrast
    },
    overdoseBox: {
        marginBottom: 2, // Increase space between overdose boxes
        width: "100%",
        backgroundColor: '#131c25',
        paddingHorizontal: 15, // Add padding for better alignment
        paddingVertical: 10, // Add vertical padding for spacing
        borderRadius: 15, // Smoothen the corners
    },
    innerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2b3849',
        padding: 10,
        borderRadius: 25,
        overflow: 'hidden', // Ensure content stays within the rounded border
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#1C2D40',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Ensure the image fits within the circle
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    content: {
        backgroundColor: '#2b3849',
        flex: 1,
    },
    infoCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2b3849',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Ensure the icon fits within the circle
    },
});
