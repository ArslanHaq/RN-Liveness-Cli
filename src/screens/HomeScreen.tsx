import { View, Text, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import CNICInput from '../components/CNICInput.tsx';
import PrimaryButton from '../components/PrimaryButton.tsx';
import Colors from '../constants/Colors.ts';
import { validateCnic } from '../utils/validateCnic.ts';
import { formatCnic } from '../utils/formatCnic.ts'; // Assuming this exists

export default function HomeScreen() {
    const [cnic, setCnic] = useState('');
    const navigation = useNavigation<any>();

    const rawCnic = cnic.replace(/\D/g, '');

    const goTo = (screenName: string) => {
        if (!validateCnic(rawCnic)) {
            console.warn('Invalid CNIC:', rawCnic);
            Alert.alert('Invalid CNIC', 'Please enter a valid 13-digit CNIC.');
            return;
        }
        console.log(`Navigating to ${screenName} with CNIC: ${rawCnic}`);
        navigation.navigate(screenName, { cnic: rawCnic });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Welcome to the Registration System</Text>

            <CNICInput value={formatCnic(cnic)} onChange={setCnic} />

            <Animated.View entering={FadeInUp.delay(300)}>
                <PrimaryButton label="Register using Picture" onPress={() => goTo('RegisterPicture')} />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(400)}>
                <PrimaryButton label="Register using ID Card" onPress={() => goTo('RegisterIdCard')} />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500)}>
                <PrimaryButton label="Verify" onPress={() => goTo('VerifyPicture')} />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(600)}>
                <PrimaryButton label="Liveness" onPress={() => goTo('Liveness')} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: Colors.white,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: Colors.text,
    },
});
