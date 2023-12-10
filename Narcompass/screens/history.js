import {FlatList, StyleSheet} from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

const data = [
    {
        ID: 1,
        time: 1634300000,
        location: "New York"
    },
    {
        ID: 2,
        time: 1634310000,
        location: "San Francisco"
    },
    {
        ID: 3,
        time: 1634320000,
        location: "London"
    },
    {
        ID: 4,
        time: 1634330000,
        location: "Tokyo"
    }
];


function mapHistoryData() {
    return data.map((item, index) => {
        return (
            <View key={index} style={styles.historyBox}>
                <View style={styles.innerBox}>
                    <Text style={styles.text}>Medical Emergency</Text>
                    <Text style={[styles.text, styles.timeText]}>
                        {new Date(item.time).toLocaleTimeString()}
                    </Text>
                    <Text style={[styles.text, styles.locationText]}>
                        {item.location}
                    </Text>
                </View>
            </View>
        );
    });
}

export default function History() {
    const historyBoxes = mapHistoryData();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>History </Text>
            <View style={styles.separator} />
            <FlatList data={historyBoxes} renderItem={({ item }) => item} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'center',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",

    },
    historyBox: {
        borderRadius: 10,
        marginBottom: 10,
        width: "100%",
    },
    historyId: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    historyTime: {

        fontSize: 14,
        color: '#ccc',
    },
    historyLocation: {

        fontSize: 14,
        color: '#ccc',
    },
    timeText: {

        marginTop: 10,
        fontSize: 14,
        textAlign: 'right',
    },
    locationText: {

        fontSize: 16,
        fontWeight: "bold",
    },
    innerBox: {
        backgroundColor: '#3498db',

        padding: 10,
    },
});
