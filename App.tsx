import React from 'react';
import {StyleSheet, useColorScheme,} from 'react-native';

import {Colors,} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen.tsx";
import Toast from "react-native-toast-message";
import RegisterPictureScreen from "./src/screens/RegistrationPictureScreen.tsx";
import RegisterIdCardScreen from "./src/screens/RegistrationIdCardScreen.tsx";
import AppHeader from "./src/components/AppHeader.tsx";
import VerifyPictureScreen from "./src/screens/VerifyPictureScreen.tsx";
import FakeLivenessScreen from "./src/screens/LivenessScreen.tsx";
import {RootStackParamList} from "./src/constants/Constants.ts";


function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    //
    // const backgroundStyle = {
    //     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    // };
    const Stack = createNativeStackNavigator<RootStackParamList>();

    return (
        <>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            header: () => <AppHeader title="Registration App" showBack={false}/>,
                        }}
                    />

                    <Stack.Screen name="RegisterPicture" component={RegisterPictureScreen}
                                  options={{
                                      header: () => <AppHeader title="Picture Registration"/>,
                                  }}
                    />
                    <Stack.Screen name="RegisterIdCard" component={RegisterIdCardScreen}
                                  options={{
                                      header: () => <AppHeader title="ID Card Registration"/>,
                                  }}
                    />
                    <Stack.Screen name="VerifyPicture" component={VerifyPictureScreen}
                                  options={{
                                      header: () => <AppHeader title="Verify"/>,
                                  }}
                    />
                    <Stack.Screen name="Liveness" component={FakeLivenessScreen}
                                  options={{
                                      header: () => <AppHeader title="Liveness"/>,
                                  }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
            <Toast/> {/* ✅ Mount this at the end */}
        </>


    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default App;
