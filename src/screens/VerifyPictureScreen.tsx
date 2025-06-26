import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useState } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import PrimaryButton from '../components/PrimaryButton';
import { verificationWithPicture } from '../api/verification';
import Colors from "../constants/Colors.ts";
import { RootStackParamList } from "../constants/Constants.ts";

type ScreenRouteProp = RouteProp<RootStackParamList, 'VerifyPicture'>;

export default function VerifyPictureScreen() {
    const { params } = useRoute<ScreenRouteProp>();
    const cnic = params.cnic;
    const faceImage = params.faceImages;

    const [imageUri, setImageUri] = useState<string>(faceImage);
    const [loading, setLoading] = useState(false);

    const removeImage = () => setImageUri('');

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

            if (result.verified) setImageUri('');
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
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>📷 Verification With Picture</Text>
                <Text style={styles.subtitle}>ID Card Number: {cnic}</Text>

                {imageUri ? (
                    <>
                        <View style={styles.imageWrapper}>
                            <Image source={{ uri: imageUri }} style={styles.preview} />
                            <TouchableOpacity style={styles.deleteIcon} onPress={removeImage} />
                        </View>

                        <PrimaryButton label="Verify" onPress={handleUpload} />
                    </>
                ) : (
                    <Text style={{ color: Colors.text }}>No image available</Text>
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
