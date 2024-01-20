import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { Text, View } from '../components/Themed';
import { onUpdateOverdoses } from '../src/graphql/subscriptions';
import { createLocation, createOverdose, deleteOverdose, getLocation, getOverdose, getUser, listLocations, updateLocation } from '../src/dbFunctions';
import { client, _ID } from '../App';
import Toast, { BaseToast } from 'react-native-toast-message';
import narcan from "../assets/images/narcan2PNG.png"
import { MaterialIcons } from "@expo/vector-icons";
import Geocoding from 'react-native-geocoding';

Geocoding.init("AIzaSyAvZPOYG_JRxzhQC-TP_KE884wXOFEjpsY"); // api key public for testing purposes and to share functionality with scholarship
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await Geocoding.from(latitude, longitude);
    const address = response.results[0].formatted_address;
    return address;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
  }
};
// Sample JSON data
export const locationData = [
  { id: _ID, title: 'Current Location', coordinate: { latitude: 40.146600, longitude: -75.271310 }, url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" },
];
export let _RADIUS = 2;

export function setRadius(rad) {
  _RADIUS = rad;
}

export function getDistance(longitude, latitude) {
  return Math.sqrt((Math.pow((latitude - locationData[0].coordinate.latitude), 2) + Math.pow((longitude - locationData[0].coordinate.longitude), 2)) * 3958.8);
}


export default function Map() {

  const showToast = (msg) => {
    Toast.show({
      type: 'customToast',
      position: 'top',
      topOffset: 35,
      visibilityTime: 20000, // notification visibility time is 20 seconds
      props: { message: msg }
    });
  }

  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const [reportButtonColor, setReportButtonColor] = useState('green'); // Initial color
  const [reportButtonText, setReportButtonText] = useState('Report');

  async function handleReportButtonPress() {
    // Toggle functionality
    if (reportButtonText === 'Report') {
      await createOverdose(client, { id: _ID, timestamp: new Date().getMilliseconds(), active: true });
      showToast("Overdose help requested!");
      // Handle logic for reporting
      // For example, change color and text
      setReportButtonColor('red');
      setReportButtonText('Cancel');
    } else {
      await deleteOverdose(client, { id: _ID });
      showToast("Help cancelled!");

      setReportButtonColor('green');
      setReportButtonText('Report');
    }
  };

  let first = true;
  let last_num = -1;

  async function refreshLocations() {
    try {
      const res = await listLocations(client, {});
      console.log(res);
      locationData.splice(1);

      res.forEach(async item => {
        const { id, latitude, longitude, timestamp } = item;
        if (id === _ID) {
          let temp = await getOverdose(client, { id: id });
          if (temp === null) return;
          const { active, helper_ids } = temp;
          if (!active) return;
          if (last_num == helper_ids.length) return;
          last_num = helper_ids.length;
          console.log("LENGTH OF HELPERS: " + helper_ids.length);
          let text1 = "" + helper_ids.length + " helping!";
          showToast(text1);
          return;
        }
        if (getDistance(longitude, latitude) > _RADIUS) return;
        let temp = await getOverdose(client, { id: id });
        if (temp === null) return;
        const { active, helper_ids } = temp;
        const { name } = await getUser(client, { id: id });
        if (active) {
          console.log('herre!')
          locationData.push({ id, title: name, coordinate: { latitude, longitude } });
          let address = await reverseGeocode(latitude, longitude);
          console.error(address)
          showToast(address);
        }

        if (helper_ids.includes(_ID)) {
          setOrigin(locationData[0].coordinate);
          setDestination({ latitude, longitude });
        }
 
        console.log(locationData)

      });



    } catch (err) {
      console.log(err);
    }




  }


  useEffect(() => {


    refreshLocations();


    const createSub = client
      .graphql({ query: onUpdateOverdoses })
      .subscribe({
        next: async ({ _data }) => {
          await refreshLocations();
          setMarkers(locationData);
          setOrigin(locationData[0].coords);
          setDestination(locationData[2].coords);


        },
        error: (error) => console.warn(error)
      });

    (async () => {
      

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let locF = await Location.watchPositionAsync({ accuracy: Location.Accuracy.Highest }, async (location) => {

        let latitude = location.coords.latitude;
        let longitude = location.coords.longitude;

        console.log(location.coords)
        if (first) {
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          });
          first = false;
        }

        locationData[0].coordinate = { latitude, longitude }
        let temp = await getLocation(client, { id: _ID });
        let d = new Date()

        if (temp === null) {
          await createLocation(client, { id: _ID, longitude, latitude, timestamp: d.getMilliseconds() });
        }
        else {
          await updateLocation(client, { id: _ID, longitude, latitude, timestamp: d.getMilliseconds() });
        }
        setMarkers(locationData);
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map</Text>
      <TouchableOpacity
        style={[styles.reportButton, { backgroundColor: reportButtonColor }]}
        onPress={handleReportButtonPress}
      >
        <Text style={styles.reportButtonText}>{reportButtonText}</Text>
      </TouchableOpacity>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
      >
        {markers.map(marker => (

          <Marker
            key={marker.title}
            coordinate={marker.coordinate}
            title={marker.title}
            image={marker.image}
            pinColor={marker.id == _ID ? 'blue' : 'red'}
          />
        ))}
        {origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey="AIzaSyAvZPOYG_JRxzhQC-TP_KE884wXOFEjpsY"
            strokeWidth={3}
            strokeColor="red"
          />
        )}
      </MapView>
      <Toast config={toastConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  reportButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 100, // Set the width to the desired size
    height: 100, // Set the height to the same value as width for a circle
    borderRadius: 50, // Half of the width/height to make a circle
    overflow: 'hidden', // Ensure circular shape
    backgroundColor: '#131c25', // Background color
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the button is above other components
  },

  reportButtonText: {
    color: '#FFFFFF', // Text color
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 0,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 0,
    height: 2,
    width: '100%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  locationText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: 'System',
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
  infoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#131c25',
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensure the icon fits within the circle
  },
});
const toastConfig = {

  customToast: ({ props }) => (
    <View
      style={{
        backgroundColor: '#131c25',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '85%',
      }}
    >
      <View style={styles.circle}>
        <Image source={narcan} style={styles.image} />
      </View>
      <Text
        style={{
          flex: 1, // To center the address text within the box
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold',
          marginLeft: 10,
          textAlign: 'center', // Center the text horizontally
        }}
      >
        {props.message}
      </Text>

      <TouchableOpacity style={styles.infoCircle} onPress={() => handleInfoClick(item)}>
        {/* Information symbol */}
        <MaterialIcons name="info" size={40} color="#FFFFFF" />
      </TouchableOpacity>

    </View>
  ),
};