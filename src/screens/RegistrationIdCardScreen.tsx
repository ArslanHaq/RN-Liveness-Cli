import {
    ActivityIndicator,
    Alert,
    Image, PermissionsAndroid, Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { launchCamera, launchImageLibrary, CameraOptions, ImageLibraryOptions } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

import PrimaryButton from '../components/PrimaryButton.tsx';
import Header from '../components/AppHeader.tsx';
import Colors from '../constants/Colors.ts';
import {registerFaceWithIdCard, registration} from '../api/registration.ts';

type RootStackParamList = {
    RegisterPicture: { cnic: string };
};

type ScreenRouteProp = RouteProp<RootStackParamList, 'RegisterPicture'>;

export default function RegisterIdCardScreen() {
    const { params } = useRoute<ScreenRouteProp>();
    const cnic = params.cnic;

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const takePicture = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'App needs camera access to take pictures',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert('Permission Denied', 'Camera permission is required.');
                return;
            }
        }

        const options: CameraOptions = {
            mediaType: 'photo',
            quality: 0.8,
            saveToPhotos: true,
        };

        setImageLoading(true);

        const result = await launchCamera(options);

        if (result.didCancel) {
            setImageLoading(false);
            return;
        }

        const uri = result.assets?.[0]?.uri;
        if (uri) setImageUri(uri);

        setImageLoading(false);
    };
    const uploadPicture = async () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 0.8,
        };

        setImageLoading(true);

        const result = await launchImageLibrary(options);
        console.log('Library result:', result);


        if (result.didCancel) {
            setImageLoading(false);
            return;
        }

        const uri = result.assets?.[0]?.uri;
        if (uri) setImageUri(uri);

        setImageLoading(false);
    };

    const handleUpload = async () => {
        if (!imageUri) return;
        setLoading(true);
        try {
            const result = await registerFaceWithIdCard(cnic, imageUri);
            console.log('Registration result:', result);
            Toast.show({
                type: 'success',
                text1: '🎉 Registered Successfully',
                text2: result?.status || 'Response received',
            });
            reset();
        } catch (error: any) {
            console.error('Registration error:', error);
            Toast.show({
                type: 'error',
                text1: 'Upload Failed',
                text2: error?.message || 'An unexpected error occurred',
            });
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setImageUri(null);
        setLoading(false);
    };

    return (
        <View style={{ flex: 1 }}>
            {/*<Header title="Register Picture" showBack />*/}
            <View style={styles.container}>
                <Text style={styles.title}>📷 Register with ID Card</Text>
                <Text style={styles.subtitle}>ID Card Number: {cnic}</Text>

                <PrimaryButton label="📸   Take Picture" onPress={takePicture} />
                <PrimaryButton label="🖼️   Upload Picture" onPress={uploadPicture} />

                {imageLoading && (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
                )}

                {imageUri && (
                    <>
                        <View style={styles.imageWrapper}>
                            <Image source={{ uri: imageUri }} style={styles.preview} />
                            <TouchableOpacity style={styles.deleteIcon} onPress={() => setImageUri(null)}>
                            </TouchableOpacity>
                        </View>

                        <PrimaryButton label="Register" onPress={handleUpload} />
                    </>
                )}

                {loading && (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        alignContent: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.text,
        marginBottom: 30,
    },
    imageWrapper: {
        position: 'relative',
        marginVertical: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        borderRadius: 12,
    },
    preview: {
        height: 250,
        borderRadius: 12,
    },
    deleteIcon: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 2,
    },
});
