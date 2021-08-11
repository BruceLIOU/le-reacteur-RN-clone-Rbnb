import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Image,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

import { Entypo } from "@expo/vector-icons";

export default function SignInScreen({ setToken, setId, apiUrl }) {
  const navigation = useNavigation();

  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [emptyFields, setEmptyFields] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleShowConfirmPassword = () => {
    if (!showConfirmPassword) {
      setShowConfirmPassword(true);
    } else {
      setShowConfirmPassword(false);
    }
  };

  const handleSubmit = async () => {
    if (email && password) {
      try {
        const response = await axios.post(`${apiUrl}/user/log_in`, {
          email: email,
          password: password,
        });
        console.log(response.data);

        if (response.data.token) {
          setToken(response.data.token);
          setId(response.data.id);
          setIsLoading(false);
        }
      } catch (error) {
        setErrorMessage(true);
        console.log(error.message);
      }
    } else {
      setEmptyFields(true);
    }
  };

  return !isLoading ? (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator size="large" color="#FF9AA2" />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <StatusBar translucent backgroundColor="transparent" />
        <View style={[styles.logo]}>
          <Image
            style={{ height: 70, width: 80 }}
            source={require("../assets/logo.png")}
            resizeMode="contain"
          />
          <Text style={[styles.titleScreen]}>Sign in</Text>
        </View>
        <View style={[styles.inputContainer]}>
          <TextInput
            style={email.length > 0 ? styles.focusedTextInput : styles.input}
            placeholder="Email"
            value={email}
            onChangeText={onChangeEmail}
            keyboardType="email-address"
            autoCapitalize="none"

            /* autoFocus={true} */
          />

          <View style={[styles.password]}>
            <TextInput
              style={
                password.length > 0 ? styles.focusedTextInput : styles.input
              }
              placeholder="Password"
              /* secureTextEntry={secure} */
              secureTextEntry={!showPassword ? true : false}
              value={password}
              onChangeText={onChangePassword}
            />
            {showPassword ? (
              <Entypo
                name="eye"
                size={14}
                color="black"
                onPress={() => setShowPassword(false)}
                style={[styles.passwordEye]}
              />
            ) : (
              <Entypo
                name="eye-with-line"
                size={14}
                color="black"
                onPress={() => setShowPassword(true)}
                style={[styles.passwordEye]}
              />
            )}
          </View>
          <View style={{ height: 40, marginBottom: 20 }}>
            {emptyFields && (
              <Text style={styles.emptyFields}>Please fill all fields !</Text>
            )}
          </View>

          <View>
            {errorMessage && (
              <Text style={styles.errorMessage}>
                Email or Password are wrong !
              </Text>
            )}
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btnSignin} onPress={handleSubmit}>
              <Text style={styles.btnSigninText}>Sign in</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text style={styles.textSignIn}>No account ? Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    /* alignItems: "center", */
    /* backgroundColor: "white", */
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
  },
  scrollView: {
    backgroundColor: "white",
    flex: 1,
  },
  scrollViewContent: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
    flex: 1,
  },
  titleScreen: {
    fontSize: 18,
    paddingTop: 20,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  input: {
    borderBottomColor: "#FFCDD1",
    borderBottomWidth: 1,
    marginBottom: 20,
    width: 300,
  },
  focusedTextInput: {
    borderBottomColor: "#FF9AA2",
    borderBottomWidth: 2,
    marginBottom: 20,
    width: 300,
  },

  password: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  passwordEye: {
    marginRight: 20,
    paddingBottom: 20,
  },
  btnContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  btnSignin: {
    borderColor: "#FB8D91",
    borderWidth: 4,
    borderRadius: 40,
    height: 50,
    width: 200,
  },
  emptyFields: {
    color: "red",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  btnSigninText: {
    flex: 1,
    fontSize: 20,
    textAlignVertical: "center",
    textAlign: "center",
  },
  textSignIn: {
    flex: 1,
    textAlign: "center",
    margin: 20,
    color: "#898989",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
