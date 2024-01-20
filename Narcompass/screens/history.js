import { FlatList, Image, StyleSheet, Text, View } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import narcan from "../assets/images/narcan2PNG.png"
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons from your package
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { getDistance, locationData } from "./map";
import { useEffect, useState } from "react";
import { appendOrRemoveHelpers, getLocation, getOverdose } from "../src/dbFunctions";
import { client } from "../App";


let data = [
    {
        ID: 1,
        time: 1634310000,
        location: 'New York',
        distance: '30 Miles',
        emergency_contact_info: '215-581-5032',
        assigned_unit: 'test',
        current_status: 'Active',
    },
    {
        ID: 2,
        time: 1634310000,
        location: "San Francisco",
        distance: '30 Miles',
        emergency_contact_info: '215-581-5032',
        assigned_unit: 'test',
        current_status: 'Active',
    },
    {
        ID: 3,
        time: 1634320000,
        location: "London",
        distance: '30 Miles',
        emergency_contact_info: '215-581-5032',
        assigned_unit: 'test',
        current_status: 'Active',
    },
    {
        ID: 4,
        time: 1634330000,
        location: "Tokyo",
        distance: '30 Miles',
        emergency_contact_info: '215-581-5032',
        assigned_unit: 'test',
        current_status: 'Active',
    },
    {
        ID: 1,
        time: 1634300000,
        location: "New York",
        distance: '30 Miles',
        emergency_contact_info: '215-581-5032',
        assigned_unit: 'test',
        current_status: 'Active',
    },
    {
        ID: 2,
        time: 1634310000,
        location: "San Francisco",
        distance: '30 Miles',
        emergency_contact_info: '215-581-5032',
        assigned_unit: 'test',
        current_status: 'Active',
    },
    {
        ID: 3,
        time: 1634320000,
        location: "London",
        distance: '30 Miles',
        emergency_contact_info: '215-581-5032',
        assigned_unit: 'test',
        current_status: 'Active',
    },
    {
        ID: 4,
        time: 1634330000,
        location: "Tokyo",
        distance: '30 Miles',
        emergency_contact_info: '215-581-5032',
        assigned_unit: 'test',
        current_status: 'Active',
    },
];


const formatPhoneNumber = (phoneNumber) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phoneNumber;
};




export default function History() {
    const navigation = useNavigation();
    const data2 = []
    const [historyBoxes, setBox] = useState([]);

    

    const handleInfoClick = (itemData) => {
        navigation.navigate('ActiveDetails', { itemData });
    };

    useEffect(() => {
        (async () => {
            for (const u of locationData) {
                if (u.id === undefined) continue;
                console.log('----------------');
                console.log(u);
                let temp = await getOverdose(client, { id: u.id });
                console.log(temp);
                if (temp === null) continue;
                let { id, helper_ids, timestamp, active } = temp;
                let { longitude, latitude } = await getLocation(client, { id: id });
                data2.push({
                    ID: id,
                    time: timestamp,
                    location: "Blue Bell",
                    distance: getDistance(longitude, latitude),
                    emergency_contact_info: formatPhoneNumber(id),
                    assigned_unit: helper_ids.length + " units active",
                    current_status: active ? 'Active' : 'Not active'
                });
            }
            console.log(data2);
           
            setBox(mapHistoryData())
        })();
    }, []);
    
    function mapHistoryData() {

        console.log(1);
        

        return data2.map((item, index) => {
            return (
                <View key={index} style={styles.historyBox}>
                    <View style={styles.innerBox}>
                        <View style={styles.circle}>
                            <Image source={narcan} style={styles.image} />
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
            );
        });
    }


    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Recent Overdoses</Text>
            </View>
            <View style={styles.separator} />
            <FlatList data={historyBoxes} renderItem={({ item }) => item} />
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
    historyBox: {
        marginBottom: 2, // Increase space between history boxes
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
