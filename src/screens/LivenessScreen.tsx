import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import Colors from '../constants/Colors';
import PrimaryButton from '../components/PrimaryButton';
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../constants/Constants.ts";

const instructions = ['Look Right ➡️', 'Look Left ⬅️', 'Look Up 🔼', 'Smile 🙂' , ' Full Face 😊'];

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;

type ScreenRouteProp = RouteProp<RootStackParamList, 'Liveness'>;

export default function LivenessScreen() {
    const {params} = useRoute<ScreenRouteProp>();
    const cnic = params.cnic;
    console.log('LivenessScreen CNIC:', cnic);

    const cameraRef = useRef<Camera>(null);
    const device = useCameraDevice('front');
    const { hasPermission, requestPermission } = useCameraPermission();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [currentStep, setCurrentStep] = useState(0);
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        requestPermission();
    }, []);

    const capturePhoto = async () => {
        setLoading(true);
        try {
            const photo = await cameraRef.current?.takePhoto({ flash: 'off' });
            if (photo?.path) {+
                setPhotos(prev => [...prev, 'file://' + photo.path]);
                if (currentStep < instructions.length - 1) {
                    setCurrentStep(prev => prev + 1);
                } else {
                    setShowResult(true);
                }
            }
        } catch (err) {
            console.error('Photo capture failed:', err);
        } finally {
            setLoading(false);
        }
    };

    const retry = () => {
        setCurrentStep(0);
        setPhotos([]);
        setShowResult(false);
    };

    const sendToBackend = async () => {
        // after last photo
        navigation.navigate('VerifyPicture', {
            faceImages: photos[photos.length - 1],
            cnic: cnic
        });
        // Alert.alert('Success', 'Photos sent successfully!');
        // setSending(true);
        // try {
        //     const formData = new FormData();
        //     photos.forEach((uri, index) => {
        //         formData.append('images', {
        //             uri,
        //             type: 'image/jpeg',
        //             name: `photo_${index + 1}.jpg`,
        //         } as any);
        //     });
        //
        //     const response = await fetch('https://your-api.com/liveness', {
        //         method: 'POST',
        //         body: formData,
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     });
        //
        //     const json = await response.json();
        //     if (response.ok) {
        //         Alert.alert('Success', 'Photos sent successfully!');
        //     } else {
        //         console.error(json);
        //         Alert.alert('Error', 'Failed to send photos.');
        //     }
        // } catch (err) {
        //     console.error(err);
        //     Alert.alert('Error', 'Something went wrong while sending photos.');
        // } finally {
        //     setSending(false);
        // }
    };

    if (!device || !hasPermission) {
        return (
            <View style={styles.centered}>
                <Text>Waiting for camera permission or device...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {!showResult ? (
                <>
                    <Camera
                        ref={cameraRef}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={true}
                        photo={true}
                    />

                    <View style={styles.overlay}>
                        <View style={styles.stepBar}>
                            {instructions.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.stepDot,
                                        { backgroundColor: index <= currentStep ? Colors.primary : '#ccc' },
                                    ]}
                                />
                            ))}
                        </View>

                        <View style={styles.captureTarget}>
                            <View style={styles.circleMask} />
                            <Text style={styles.circleNote}>Keep your face inside the circle</Text>
                        </View>

                        <Text style={styles.instruction}>{instructions[currentStep]}</Text>

                        {loading ? (
                            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />
                        ) : (
                            <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
                                <Text style={styles.captureText}>Capture</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </>
            ) : (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>🎉 Liveness Completed</Text>
                    <View style={styles.imageRow}>
                        {photos.map((img, idx) => (
                            <Image key={idx} source={{ uri: img }} style={styles.resultImage} />
                        ))}
                    </View>

                    <View style={styles.buttonRow}>
                        <PrimaryButton label="Retry" onPress={retry} />
                        <PrimaryButton
                            label={sending ? 'Sending...' : 'Send'}
                            onPress={sendToBackend}
                            disabled={sending}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepBar: {
        position: 'absolute',
        top: 50,
        flexDirection: 'row',
        gap: 10,
        zIndex: 10,
    },
    stepDot: {
        width: 15,
        height: 15,
        borderRadius: 9,
    },
    captureTarget: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    circleMask: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        borderWidth: 4,
        borderColor: Colors.primary,
    },
    circleNote: {
        marginTop: 10,
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    instruction: {
        marginTop: 20,
        fontSize: 20,
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // semi-transparent dark background
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        overflow: 'hidden',
        textShadowColor: '#000',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    captureButton: {
        marginTop: 30,
        backgroundColor: Colors.primary,
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 5,
    },
    captureText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
    },
    resultTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 20,
    },
    imageRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    resultImage: {
        width: 100,
        height: 100,
        margin: 8,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 12,
    },
});
