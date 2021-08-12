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
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { SwiperFlatList } from "react-native-swiper-flatlist";

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
        console.log(response.data);
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

  const renderItem = ({ item }) => {
    return <Image style={styles.img} source={{ uri: item.url }} />;
  };

  return isLoading ? (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#FF9AA2" />
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
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
              console.log("goback");
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
          <SwiperFlatList
            showPagination
            data={data.photos}
            renderItem={({ item }) => (
              <View style={{ width, justifyContent: "center" }}>
                <Image
                  source={{
                    uri: item.url,
                  }}
                  key={item.picture_id}
                  resizeMode="cover"
                  style={styles.cardImage}
                />
                <View style={styles.priceView}>
                  <Text style={styles.price}>{data.price} €</Text>
                </View>
              </View>
            )}
          ></SwiperFlatList>
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
        {viewMore === 10 && <View style={styles.separator}></View>}
        <View style={styles.mapContainer}>
          <Image
            style={{ height: 300 }}
            source={require("../assets/map.jpg")}
            resizeMode="cover"
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
    borderBottomColor: "red",
    borderBottomWidth: 1,
    marginTop: 40,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    marginBottom: 10,
    width: 400,
    flexDirection: "row",
    maxHeight: 20,
    marginLeft: 4,
  },
  goBack: {
    height: 40,
    justifyContent: "center",
    paddingBottom: 20,
  },
  logo: {
    flex: 1,
    alignItems: "center",
    marginLeft: -40,
    marginTop: -30,
  },
  imgContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 15,
  },
  child: { width, justifyContent: "center" },
  text: { fontSize: width * 0.5, textAlign: "center" },
  cardImage: {
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
    flexDirection: "row",
    marginLeft: 20,
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
  },
  separator: {
    height: 120,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
