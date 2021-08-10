import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

export default function SignUpScreen({ setToken }) {
  const [email, onChangeEmail] = useState("");
  const [username, onChangeUsername] = useState("");
  const [description, onChangeDescription] = useState("");
  const [password, onChangePassword] = useState("");
  const [confirmPassword, onChangeConfirmPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorSamePassword, setErrorSamePassword] = useState(false);

  const handleSubmit = async () => {
    try {
      if (password !== confirmPassword) {
        setErrorSamePassword(true);
      } else {
        const response = await axios.post(
          "https://le-reacteur-rn-airbnb-backend.herokuapp.com/user/sign_up",
          { email, username, description, password }
        );
        console.log(response.data);

        if (response.data.token) {
          setToken(response.data.token);
          // TODO déclarer setId dans App.js (comme setToken)et ajouter la props dans SignUpScreen
          /* setId(response.data.id); */
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView>
        <StatusBar style="transparent" />
        <View style={[styles.logo]}>
          <Image
            style={{ height: 70, width: 80 }}
            source={require("../assets/logo.png")}
            resizeMode="contain"
          />
          <Text style={[styles.titleScreen]}>Sign up</Text>
        </View>
        <View style={[styles.inputContainer]}>
          <TextInput
            style={email.length > 0 ? styles.focusedTextInput : styles.input}
            placeholder="Email"
            value={email}
            onChangeText={onChangeEmail}

            /* autoFocus={true} */
          />
          <TextInput
            style={username.length > 0 ? styles.focusedTextInput : styles.input}
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
          <TextInput
            style={password.length > 0 ? styles.focusedTextInput : styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={onChangePassword}
          />
          <TextInput
            style={
              confirmPassword.length > 0
                ? styles.focusedTextInput
                : styles.input
            }
            placeholder="Confirm password"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={onChangeConfirmPassword}
          />
          {errorSamePassword && (
            <Text style={styles.errorSamePassword}>
              Passwords must be the same
            </Text>
          )}

          {/*         <Button
          title="Sign up"
          onPress={async () => {
            const userToken = "secret-token";
            setToken(userToken);
          }}
        /> */}
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btnSignup} onPress={handleSubmit}>
              <Text style={styles.btnSignupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    /* marginTop: Platform.OS === "android" ? Constants.statusBarHeight : 0, */
  },
  logo: {
    alignItems: "center",
    padding: 24,
  },
  titleScreen: {
    fontSize: 18,
    paddingTop: 20,
  },
  inputContainer: {
    flex: 1,
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
  },
  focusedTextareaInput: {
    borderColor: "#FF9AA2",
    borderWidth: 2,
    textAlignVertical: "top",
    padding: 8,
    marginBottom: 20,
  },
  textarea: {
    marginBottom: 20,
    borderColor: "#FFCDD1",
    borderWidth: 1,
    textAlignVertical: "top",
    padding: 8,
  },
  btnContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  btnSignup: {
    borderColor: "#FB8D91",
    borderWidth: 4,
    borderRadius: 40,
    height: 50,
    width: 200,
  },
  errorSamePassword: {
    color: "red",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
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
    margin: 20,
    color: "#898989",
  },
});
