import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import RoomScreen from "./containers/RoomScreen";
import AroundMeScreen from "./containers/AroundMeScreen";
import SettingsScreen from "./containers/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/* const apiUrl = "http://localhost:3001"; */
const apiUrl = "https://express-airbnb-api.herokuapp.com";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(AsyncStorage.getItem("userId") || null);
  const [userToken, setUserToken] = useState(
    AsyncStorage.getItem("userToken") || null
  );

  const setToken = async (token) => {
    if (token) {
      AsyncStorage.setItem("userToken", token);
    } else {
      AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };

  const setId = async (id) => {
    if (id) {
      AsyncStorage.setItem("userId", id);
    } else {
      AsyncStorage.removeItem("userId");
    }

    setUserId(id);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setIsLoading(false);
      setUserToken(userToken);
      setUserId(userId);
    };

    bootstrapAsync();
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? null : userToken === null ? ( // We haven't finished checking for the token yet
        // No token found, user isn't signed in
        <Stack.Navigator>
          <Stack.Screen name="SignIn" options={{ headerShown: false }}>
            {() => (
              <SignInScreen setId={setId} setToken={setToken} apiUrl={apiUrl} />
            )}
          </Stack.Screen>
          <Stack.Screen name="SignUp" options={{ headerShown: false }}>
            {() => (
              <SignUpScreen setId={setId} setToken={setToken} apiUrl={apiUrl} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        // User is signed in
        <Stack.Navigator>
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: "tomato",
                  inactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="Home"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Home"
                        options={{
                          title: "Home",
                          headerStyle: { backgroundColor: "red" },
                          headerTitleStyle: { color: "white" },
                          headerShown: false,
                        }}
                      >
                        {() => <HomeScreen apiUrl={apiUrl} />}
                      </Stack.Screen>
                      <Stack.Screen
                        name="Room"
                        options={{
                          headerShown: false,
                        }}
                      >
                        {() => <RoomScreen apiUrl={apiUrl} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="AroundMe"
                  options={{
                    tabBarLabel: "Around Me",
                    tabBarIcon: ({ color, size }) => (
                      <Feather name={"map-pin"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="AroundMe"
                        options={{
                          title: "Around Me",
                          tabBarLabel: "Around Me",
                          headerShown: false,
                        }}
                      >
                        {() => <AroundMeScreen apiUrl={apiUrl} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="Profile"
                  options={{
                    tabBarLabel: "My profile",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                      <AntDesign name={"user"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Profile"
                        options={{
                          headerShown: false,
                          title: "My profile",
                          tabBarLabel: "Profile",
                        }}
                      >
                        {() => (
                          <ProfileScreen
                            setToken={setToken}
                            userToken={userToken}
                            apiUrl={apiUrl}
                            userId={userId}
                            setId={setId}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
