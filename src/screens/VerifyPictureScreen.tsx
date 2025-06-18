import {
    ActivityIndicator,
    Alert,
    Image,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {CameraOptions, launchCamera,} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

import PrimaryButton from '../components/PrimaryButton';
import {verificationWithPicture} from '../api/verification';
import Colors from "../constants/Colors.ts";

;

type RootStackParamList = {
    VerifyPicture: { cnic: string };
};

type ScreenRouteProp = RouteProp<RootStackParamList, 'VerifyPicture'>;

export default function VerifyPictureScreen() {
    const {params} = useRoute<ScreenRouteProp>();
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

        try {
            const result = await launchCamera(options);
            if (result.didCancel) return;
            const uri = result.assets?.[0]?.uri;
            if (uri) setImageUri(uri);
        } catch (err: any) {
            Alert.alert('Camera Error', err?.message || 'Unable to launch camera.');
        } finally {
            setImageLoading(false);
        }
    };

    const removeImage = () => setImageUri(null);

    const handleUpload = async () => {
        if (!imageUri) return;

        setLoading(true);
        try {
            const result = await verificationWithPicture(cnic, imageUri, true);

            Toast.show({
                type: result.verified ? 'success' : 'error',
                text1: result.verified
                    ? '✅ Verification Passed'
                    : '❌ Verification Failed',
                text2: `Similarity: ${(result.similarity * 100).toFixed(2)}%`,
            });
            if (result.verified) setImageUri(null);
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: '❌ Upload Failed',
                text2: error?.message || 'An unexpected error occurred',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{flex: 1}}>
            <View style={styles.container}>
                <Text style={styles.title}>📷 Verification With Picture</Text>
                <Text style={styles.subtitle}>ID Card Number: {cnic}</Text>

                <PrimaryButton label="📸   Take Picture" onPress={takePicture}/>

                {imageLoading && (
                    <ActivityIndicator size="large" color={Colors.primary} style={{marginTop: 20}}/>
                )}

                {imageUri && (
                    <>
                        <View style={styles.imageWrapper}>
                            <Image source={{uri: imageUri}} style={styles.preview}/>
                            <TouchableOpacity style={styles.deleteIcon} onPress={removeImage}>
                            </TouchableOpacity>
                        </View>

                        <PrimaryButton label="Verify" onPress={handleUpload}/>
                    </>
                )}

                {loading && (
                    <ActivityIndicator size="large" color={Colors.primary} style={{marginTop: 20}}/>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 20,
        paddingVertical: 50,
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
        shadowOffset: {width: 0, height: 4},
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
