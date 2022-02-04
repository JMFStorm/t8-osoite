import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  Button,
  SafeAreaView,
  TextInput,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const apiKey = "0QzsNsjohQ8GS4OpFLJsAFmsrh9bAvxC";
const baseUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=${apiKey}`;

const mapInitial = {
  latitude: 60.200692,
  longitude: 24.934302,
  latitudeDelta: 0.0322,
  longitudeDelta: 0.0221,
};

const coordinates = {
  latitude: 60.201373,
  longitude: 24.934041,
};

const fetchLocation = async (keyword) => {
  try {
    const searchUrl = baseUrl + `&location=${keyword}`;
    const response = await fetch(searchUrl);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [markerCoordinate, setMarkerCoordinate] = useState(coordinates);
  const mapRef = React.useRef(null);

  const handleShowLocation = React.useCallback(async () => {
    const result = await fetchLocation(keyword);
    const coordinates = result.results[0].locations[0].latLng ?? null;

    setMarkerCoordinate({
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    });

    mapRef.current.setCamera({
      center: {
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      },
      pitch: 0,
      heading: 0,
      // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
      altitude: 11,
      // Only when using Google Maps.
      zoom: 11,
    });
  }, [fetchLocation, setMarkerCoordinate, keyword]);

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={mapInitial}>
        <Marker coordinate={markerCoordinate} />
      </MapView>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={setKeyword}
          value={keyword}
        />
      </View>
      <Pressable
        style={styles.button}
        onPress={handleShowLocation}
        title="Show"
        accessibilityLabel="Show"
      >
        <Text style={styles.text}>Show</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
    width: "100%",
    height: 300,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#2222cc",
    marginBottom: 16,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 250,
  },
});
