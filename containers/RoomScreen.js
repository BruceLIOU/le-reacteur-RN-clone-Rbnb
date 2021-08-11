import React, { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/core";
import axios from "axios";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Image,
} from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { Entypo, AntDesign } from "@expo/vector-icons";

export default function RoomScreen({ apiUrl }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState("");
  const { params } = useRoute();
  const navigation = useNavigation();
  const [viewMore, setViewMore] = useState(3);

  const Stars = ({ rating, reviews }) => {
    const render = () => {
      let star = [];
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          star.push(
            <Entypo
              key={i}
              name="star"
              size={18}
              color="#f3c945"
              style={styles.starRating}
            />
          );
        } else {
          star.push(
            <Entypo
              key={i}
              name="star"
              size={18}
              color="#bebdbb"
              style={styles.starRating}
            />
          );
        }
      }
      return star;
    };
    return (
      <View style={styles.starsContainer}>
        {render()}
        <Text style={styles.ratingValue}>{reviews} reviews</Text>
      </View>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/rooms/${params.id}`);
        /* console.log(response.data); */
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        /* console.log(error.message); */
        /* console.log(Object.keys(error)); */
        console.log(error.response);
      }
    };
    fetchData();
  }, [params.id]);

  return isLoading ? (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#FF9AA2" />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      <View style={styles.logoContainer}>
        <AntDesign
          style={styles.goBack}
          name="arrowleft"
          size={24}
          color="black"
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={styles.logo}>
          <Image
            style={{ height: 50, width: 60 }}
            source={require("../assets/logo.png")}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={styles.imgContainer}>
        <ImageBackground
          style={styles.imgRoom}
          source={{ uri: data.photos[0].url }}
        >
          <View style={styles.priceView}>
            <Text style={styles.price}>{data.price} €</Text>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.titleContainer}>
        <View style={styles.itemContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {data.title}
          </Text>
          <Stars rating={data.ratingValue} reviews={data.reviews} />
        </View>
        <View style={styles.itemContainer}>
          <Image
            style={styles.profileImg}
            source={{ uri: data.user.account.photo.url }}
          />
        </View>
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description} numberOfLines={viewMore}>
          {data.description}
        </Text>

        {viewMore === 3 ? (
          <TouchableOpacity
            onPress={() => {
              setViewMore(10);
            }}
          >
            <Text style={styles.showDescription}>
              Show more <AntDesign name="caretdown" size={12} color="grey" />
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setViewMore(3)}>
            <Text style={styles.showDescription}>
              Show less <AntDesign name="caretup" size={12} color="grey" />
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {viewMore === 10 && <View></View>}
      <View style={styles.mapContainer}>
        <Image
          style={{ height: 250 }}
          source={require("../assets/map.jpg")}
          resizeMode="cover"
        />
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
  logoContainer: {
    flex: 1,
    alignItems: "center",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    marginBottom: 10,
    width: 400,
    flexDirection: "row",
    maxHeight: 50,
    marginLeft: 4,
  },
  goBack: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  logo: {
    marginLeft: 140,
  },
  imgContainer: {
    flex: 1,
    marginHorizontal: 15,
  },
  imgRoom: {
    height: 250,
    width: 400,
  },
  priceView: {
    height: 40,
    width: 90,
    backgroundColor: "black",
    position: "absolute",
    bottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    color: "white",
    fontSize: 18,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 100,
  },
  itemContainer: {
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 18,
    width: 280,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    flex: 1,
    /* alignItems: "center", */
    maxHeight: 20,
  },
  starRating: {
    marginRight: 8,
  },
  ratingValue: {
    fontSize: 18,
    color: "#BBBBBB",
  },

  profileImg: {
    height: 80,
    width: 80,
    borderRadius: 50,
    marginLeft: 80,
    marginTop: 10,
  },
  descriptionContainer: {
    flex: 1,
    marginHorizontal: 20,
    height: 30,
  },
  description: {
    fontSize: 13,
    marginBottom: 5,
  },
  showDescription: {
    fontSize: 13,
    color: "grey",
    marginBottom: 20,
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 200,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
