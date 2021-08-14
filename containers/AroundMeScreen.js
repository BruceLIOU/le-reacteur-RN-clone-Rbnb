import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function AroundMeScreen({ apiUrl }) {
  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [coords, setCoords] = useState();
  const [errorCoords, setErrorCoords] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const getPermission = async () => {
      try {
        // Demander la permission d'accès aux coordonnées de l'appareil
        const { status } = await Location.requestForegroundPermissionsAsync();
        /* console.log(status); */

        if (status === "granted") {
          // Récupérer les coordonnées GPS
          const location = await Location.getCurrentPositionAsync();
          /* console.log(location); */
          const obj = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setCoords(obj);
          setIsLoading(false);
        } else {
          alert("Permission denied !");
          setErrorCoords(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      try {
        /* const response = await axios.get(
          `${apiUrl}/rooms/around?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`
        ); */
        const response = await axios.get(`${apiUrl}/rooms/around`);

        /* console.log("****** AROUND ME ROOMS RESPONSE ****** ", response.data); */
        setData(response.data);
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchData();

    getPermission();
  }, []);

  return isLoading ? (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#FF9AA2" />
    </View>
  ) : errorCoords ? (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={[styles.logo]}>
        <Image
          style={{ height: 50, width: 60 }}
          source={require("../assets/logo.png")}
          resizeMode="contain"
        />
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 48.856614,
            longitude: 2.3522219,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
        >
          {data.map((position, index) => {
            return (
              <MapView.Marker
                key={index}
                coordinate={{
                  latitude: position.location[1],
                  longitude: position.location[0],
                }}
                title={position.title}
              />
            );
          })}
        </MapView>
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={[styles.logo]}>
        <Image
          style={{ height: 50, width: 60 }}
          source={require("../assets/logo.png")}
          resizeMode="contain"
        />
      </View>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 48.856614,
            longitude: 2.3522219,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
        >
          {data.map((room) => {
            return (
              <MapView.Marker
                key={room._id}
                coordinate={{
                  latitude: room.location[1],
                  longitude: room.location[0],
                }}
                title={room.title}
                onPress={() => {
                  navigation.navigate("Room", { id: room._id });
                }}
              />
            );
          })}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
    borderBottomColor: "red",
    borderBottomWidth: 1,
  },
  logo: {
    /* flex: 1, */
    alignItems: "center",
    width: 400,
    marginTop: 10,
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    height: 600,
    width: 400,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
