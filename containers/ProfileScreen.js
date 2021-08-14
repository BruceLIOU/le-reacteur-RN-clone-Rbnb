import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function ProfileScreen({
  userId,
  setId,
  userToken,
  setToken,
  apiUrl,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const [email, onChangeEmail] = useState("");
  const [username, onChangeUsername] = useState("");
  const [description, onChangeDescription] = useState("");

  const [emptyFields, setEmptyFields] = useState(false);
  const [userEmailExist, setUserEmailExist] = useState(false);
  const [userNameExist, setUserNameExist] = useState(false);

  const [image, setImage] = useState(null);
  /*   setToken(null);
  setId(null); */

  const handleSubmit = async () => {
    if (email && username && description) {
      try {
        const response = await axios.post(`${apiUrl}/user/update`, {
          email,
          username,
          description,
        });
        console.log(response.data);

        if (response.data.token) {
          setToken(response.data.token);
          setId(response.data.id);
          setIsLoading(false);
        }
      } catch (error) {
        if (
          error.response.data.error === "This email already has an account."
        ) {
          setUserEmailExist(true);
        } else if (
          error.response.data.error === "This username already has an account."
        ) {
          setUserNameExist(true);
        }
        console.log(error.message);
        console.log("catch");
      }
    } else {
      setEmptyFields(true);
    }
  };
  console.log(userId);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/${userId}`, {
          headers: {
            authorization: `Bearer ${userToken}`,
          },
        });

        console.log("Data Profile : ", response.data);
        /*         setaData(response.data);
        {
          response.data.photo && setPicture(response.data.photo[0].url);
        }
        setIsLoading(false); */
        if (response.data.id) {
          setData(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchData();
  }, []);

  return isLoading ? (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#FF9AA2" />
    </View>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/logo.png")}
            resizeMode="contain"
          />
        </View>
        <View style={styles.accountContainer}>
          <View style={styles.imgUserContainer}>
            <View style={styles.imgUser}>
              {data.photo.url ? (
                <Image
                  style={styles.profileImg}
                  source={{ uri: image || data.photo.url }}
                />
              ) : (
                <FontAwesome5
                  name="user-alt"
                  size={140}
                  color="lightgrey"
                  style={{ marginBottom: 15 }}
                />
              )}
            </View>
          </View>
          <View style={styles.imgBtnContainer}>
            <View style={styles.imgBtn}>
              <MaterialIcons name="photo-library" size={45} color="grey" />
              <View style={{ height: 30 }}></View>
              <MaterialIcons name="photo-camera" size={45} color="grey" />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={email.length > 0 ? styles.focusedTextInput : styles.input}
              placeholder="Email"
              defaultValue={data.email}
              onChangeText={onChangeEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={
                username.length > 0 ? styles.focusedTextInput : styles.input
              }
              placeholder="Username"
              defaultValue={data.username}
              onChangeText={onChangeUsername}
            />
            <TextInput
              style={
                description.length > 0
                  ? styles.focusedTextareaInput
                  : styles.textarea
              }
              placeholder="Describe yourself in a few words..."
              defaultValue={data.description}
              multiline
              numberOfLines={4}
              onChangeText={onChangeDescription}
            />
          </View>
          <View style={styles.errorMessage}>
            {emptyFields && (
              <Text style={styles.emptyFields}>All fields are required !</Text>
            )}
            {userEmailExist && (
              <Text style={styles.userExist}>
                This email already has an account !
              </Text>
            )}
            {userNameExist && (
              <Text style={styles.userExist}>
                This username already has an account !
              </Text>
            )}
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btnUpdate} onPress={handleSubmit}>
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnLogout}
              onPress={() => {
                setToken(null);
                setId(null);
              }}
            >
              <Text style={styles.btnText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    /* flex: 1, */
    backgroundColor: "white",
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
    marginBottom: 20,
  },
  logoContainer: {
    flex: 1,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    marginBottom: 20,
    flexDirection: "row",
    maxHeight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    height: 50,
    width: 60,
    marginTop: -50,
  },
  accountContainer: {
    flex: 1,
  },
  imgUserContainer: {
    flex: 1,
    flexDirection: "column",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  imgUser: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 100,
    width: 200,
    height: 200,
  },
  profileImg: {
    height: 140,
    width: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  imgBtnContainer: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    top: 50,
    right: 30,
  },
  imgBtn: {
    /* marginBottom: 40, */
  },
  formSignUp: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderBottomColor: "#FFCDD1",
    borderBottomWidth: 1,
    width: 300,
    marginBottom: 30,
  },
  focusedTextInput: {
    borderBottomColor: "#FF9AA2",
    borderBottomWidth: 2,
    width: 300,
    marginBottom: 20,
  },
  textarea: {
    marginBottom: 20,
    borderColor: "#FFCDD1",
    borderWidth: 1,
    textAlignVertical: "top",
    padding: 8,
    width: 300,
    marginBottom: 20,
  },
  focusedTextareaInput: {
    borderColor: "#FF9AA2",
    borderWidth: 2,
    textAlignVertical: "top",
    padding: 8,
    width: 300,
    marginBottom: 20,
  },
  errorMessage: {},
  emptyFields: {},
  userExist: {},
  btnContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnUpdate: {
    width: 200,
    height: 60,
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 30,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  btnLogout: {
    width: 200,
    height: 60,
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 30,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    /* marginBottom: 100, */
    backgroundColor: "lightgrey",
  },
  btnText: {
    fontSize: 18,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
