import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useLoadedAssets } from "./hooks/useLoadedAssets";
import Navigation from "./navigation";
import { useColorScheme } from "react-native";
import { AppRegistry } from "react-native";
import { useEffect } from "react";
import { createUser, getUser } from "./screens/dbFunctions";
import DeviceInfo from "react-native-device-info";
import { generateClient } from "@aws-amplify/api";

export const client = generateClient();
export let _ID = "5134303490" // test sample phone number

export default function App() {
  const isLoadingComplete = useLoadedAssets();
  const colorScheme = useColorScheme();

  useEffect(() => {

    (async () => {
      let temp = await getUser(client, { id: _ID });
      console.log(temp);
      if (temp === null) {

        await createUser(client, { name: "Main User", age: -1, phoneNumber: _ID });
      }
    })()
  }, [])

  const requestPhoneNumberPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          {
            title: 'Phone Number Permission',
            message: 'This app needs access to your phone number',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          _ID = await DeviceInfo.getPhoneNumber()
        } else {
          console.log('Phone number permission denied');
        }
      }
    } catch (error) {
      console.error('Error requesting phone number permission:', error);
    }
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

AppRegistry.registerComponent("narcompass", () => App);

