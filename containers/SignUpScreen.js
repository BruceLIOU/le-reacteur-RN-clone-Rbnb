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
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

import { Entypo } from "@expo/vector-icons";

export default function SignUpScreen({ setToken, setId, apiUrl }) {
  const navigation = useNavigation();

  const [email, onChangeEmail] = useState("");
  const [username, onChangeUsername] = useState("");
  const [description, onChangeDescription] = useState("");
  const [password, onChangePassword] = useState("");
  const [confirmPassword, onChangeConfirmPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorSamePassword, setErrorSamePassword] = useState(false);
  const [emptyFields, setEmptyFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userEmailExist, setUserEmailExist] = useState(false);
  const [userNameExist, setUserNameExist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isEmailValid = (userEmail) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(userEmail) == 0;
  };

  const handleSubmit = async () => {
    if (email && username && description && password && confirmPassword) {
      try {
        if (password !== confirmPassword) {
          setErrorSamePassword(true);
        } else {
          const response = await axios.post(`${apiUrl}/user/sign_up`, {
            email,
            username,
            description,
            password,
          });
          console.log(response.data);

          if (response.data.token) {
            setToken(response.data.token);
            setId(response.data.id);
            setIsLoading(false);
          }
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
    <ScrollView bounces={false} contentContainerStyle={styles.container}>
      <KeyboardAwareScrollView extraScrollHeight={110}>
        <SafeAreaView>
          <StatusBar translucent backgroundColor="transparent" />
          <View style={[styles.logo]}>
            <Image
              style={{ height: 90, width: 100 }}
              source={require("../assets/logo.png")}
              resizeMode="contain"
            />
            <Text style={[styles.titleScreen]}>Sign up</Text>
          </View>
          <View style={[styles.formSignUp]}>
            <View style={[styles.inputContainer]}>
              <TextInput
                style={
                  email.length > 0 ? styles.focusedTextInput : styles.input
                }
                placeholder="Email"
                value={email}
                onChangeText={onChangeEmail}
                keyboardType="email-address"
                autoCapitalize="none"

                /* autoFocus={true} */
              />
              {errorEmail && <Text>error</Text>}

              <TextInput
                style={
                  username.length > 0 ? styles.focusedTextInput : styles.input
                }
                placeholder="Username"
                value={username}
                onChangeText={onChangeUsername}
              />
              <TextInput
                style={
                  description.length > 0
                    ? styles.focusedTextareaInput
                    : styles.textarea
                }
                placeholder="Describe yourself in a few words..."
                value={description}
                multiline
                numberOfLines={4}
                onChangeText={onChangeDescription}
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
              <View style={[styles.password]}>
                <TextInput
                  style={
                    confirmPassword.length > 0
                      ? styles.focusedTextInput
                      : styles.input
                  }
                  placeholder="Confirm password"
                  secureTextEntry={!showConfirmPassword ? true : false}
                  value={confirmPassword}
                  onChangeText={onChangeConfirmPassword}
                />
                {showConfirmPassword ? (
                  <Entypo
                    name="eye"
                    size={14}
                    color="black"
                    onPress={() => setShowConfirmPassword(false)}
                    style={[styles.passwordEye]}
                  />
                ) : (
                  <Entypo
                    name="eye-with-line"
                    size={14}
                    color="black"
                    onPress={() => setShowConfirmPassword(true)}
                    style={[styles.passwordEye]}
                  />
                )}
              </View>
            </View>
            <View style={{ height: 20, marginBottom: 0 }}>
              {emptyFields && (
                <Text style={styles.emptyFields}>
                  All fields are required !
                </Text>
              )}
            </View>
            <View style={{ height: 20, marginBottom: 0 }}>
              {errorSamePassword && (
                <Text style={styles.errorSamePassword}>
                  Passwords must be the same
                </Text>
              )}
            </View>
            <View style={{ height: 20, marginBottom: 0 }}>
              {userEmailExist && (
                <Text style={styles.userExist}>
                  This email already has an account !
                </Text>
              )}
            </View>
            <View style={{ height: 20, marginBottom: 0 }}>
              {userNameExist && (
                <Text style={styles.userExist}>
                  This username already has an account !
                </Text>
              )}
            </View>
            {isLoading && (
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.btnSignup}
                  onPress={handleSubmit}
                >
                  <Text style={styles.btnSignupText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignIn");
              }}
            >
              <Text style={styles.textSignIn}>
                Already have an account ? Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
  },
  logo: {
    flex: 1,
    alignItems: "center",
  },
  titleScreen: {
    fontSize: 24,
    paddingTop: 20,
    color: "#717171",
  },
  formSignUp: {
    justifyContent: "center",
  },
  inputContainer: {
    height: 300,
    marginTop: 50,
    justifyContent: "center",
  },
  input: {
    borderBottomColor: "#FFCDD1",
    borderBottomWidth: 1,
    width: 300,
    marginBottom: 20,
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
  password: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  passwordEye: {
    paddingBottom: 20,
  },
  btnContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: 80,
    marginTop: 10,
  },
  btnSignup: {
    borderColor: "#FB8D91",
    borderWidth: 4,
    borderRadius: 40,
    height: 50,
    width: 200,
  },
  emptyFields: {
    color: "red",
    textAlign: "center",
  },
  btnSignupText: {
    flex: 1,
    fontSize: 20,
    textAlignVertical: "center",
    textAlign: "center",
  },
  textSignIn: {
    flex: 1,
    textAlign: "center",
    margin: 10,
    color: "#898989",
    justifyContent: "center",
    borderColor: "red",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
