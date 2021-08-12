import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Image,
} from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { Entypo } from "@expo/vector-icons";

/* import LoaderLottie from "../components/LoaderLottie";
import LottieView from "lottie-react-native"; */

export default function HomeScreen({ apiUrl }) {
  const [selectedId, setSelectedId] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  const Stars = ({ rating }) => {
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
    return <View style={styles.stars}>{render()}</View>;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${apiUrl}/rooms?city=paris`);
      /* console.log(response.data); */
      setData(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handlePress = (idRoom) => {
    setSelectedId(idRoom);
    navigation.navigate("Room", { id: idRoom });
    /* console.log(idRoom); */
  };

  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
      <ImageBackground
        style={styles.imgRoom}
        source={{ uri: item.photos[0].url }}
      >
        <View style={styles.priceView}>
          <Text style={styles.price}>{item.price} €</Text>
        </View>
      </ImageBackground>
      <View style={styles.titleContainer}>
        <View>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.starsContainer}>
            <Stars rating={item.ratingValue} />
            <Text style={styles.ratingValue}>{item.reviews} reviews</Text>
          </View>
        </View>
        <View style={styles.profileImgContainer}>
          <Image
            style={styles.profileImg}
            source={{ uri: item.user.account.photo.url }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        onPress={() => handlePress(item._id)}
        style={styles.card}
      />
    );
  };

  return isLoading ? (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#FF9AA2" />
      {/* <LoaderLottie /> */}
      {/*       <LottieView
        source={require("../assets/lf20_j1duSs.json")}
        autoPlay
        loop
      /> */}
    </View>
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
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        extraData={selectedId}
      />
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
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    width: 400,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    marginHorizontal: 15,
  },
  imgRoom: {
    height: 210,
    width: 360,
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
    marginVertical: 20,
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    flex: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    justifyContent: "flex-start",
    textAlign: "left",
    width: 300,
  },
  profileImgContainer: {
    marginLeft: 300,
    width: 70,
    position: "absolute",
  },
  profileImg: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  starRating: {
    marginRight: 8,
  },
  ratingValue: {
    fontSize: 18,
    color: "#BBBBBB",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
