import { FlatList, Image, StyleSheet, Text, View } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
// import narcan from "../assets/images/narcan2.jpg"
import narcan from "../assets/images/narcan2PNG.png"
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons from your package
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const data = [
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


function mapHistoryData() {
    const navigation = useNavigation();

    const handleInfoClick = (itemData) => {
        navigation.navigate('ActiveDetails', { itemData });
    };
    return data.map((item, index) => {
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

export default function History() {
    const historyBoxes = mapHistoryData();


    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Recent Overdoses</Text>
                <Text style={styles.count}>10</Text>
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
        // alignItems: "center",
        // justifyContent: "center",
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'System',
    },
    count: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'System',
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'center',
        color: "#FFFFFF",
        fontFamily: 'System',

    },
    locationText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFFFFF",
        fontFamily: 'System',
    },
    timeText: {
        fontSize: 14,
        // color: "#FFFFFF",
        color: "#8491a1",
        fontFamily: 'System',
    },
    separator: {
        marginVertical: 2,
        height: 3,
        backgroundColor: '#131c25',
    },
    historyBox: {
        marginBottom: 15,
        width: "100%",
        backgroundColor: '#131c25',

    },
    innerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a323d',
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
        backgroundColor: '#2a323d',

        flex: 1,
    },
    infoCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2a323d',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Ensure the icon fits within the circle
    },
});