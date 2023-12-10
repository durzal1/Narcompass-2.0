import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Text, View } from '../components/Themed';

export default function TabOneScreen() {
  const [markers, setMarkers] = useState([]);

  // Sample JSON data
  const sampleData = [
    { id: 1, title: 'Marker 1', coordinate: { latitude: -34.603738, longitude: -58.38157 } },
    { id: 2, title: 'Marker 2', coordinate: { latitude: -34.603, longitude: -58.382 } },
    // Add more data as needed
  ];

  useEffect(() => {
    setMarkers(sampleData);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -34.603738,
          longitude: -58.38157,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
