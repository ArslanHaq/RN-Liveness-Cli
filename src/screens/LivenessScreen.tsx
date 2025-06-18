import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useCameraPermission, useCameraDevice, Camera } from 'react-native-vision-camera';
import { useRoute, RouteProp } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import Colors from '../constants/Colors';
import PrimaryButton from '../components/PrimaryButton';

const instructions = [
    'Blink both eyes 👀',
    'Look right ➡️',
    'Look left ⬅️',
    'Look up 🔼',
    'Smile 🙂',
];

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.9;

type RootStackParamList = {
    FakeLiveness: { cnic: string };
};

export default function FakeLivenessScreen() {
    const route = useRoute<RouteProp<RootStackParamList, 'FakeLiveness'>>();
    const cnic = route.params.cnic;

    const device = useCameraDevice('front');
    const { hasPermission, requestPermission } = useCameraPermission();

    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        requestPermission();
    }, []);

    useEffect(() => {
        if (currentStep < instructions.length) {
            const timer = setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
                setProgress(((currentStep + 1) / instructions.length) * 100);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            capturePhoto();
        }
    }, [currentStep]);

    const capturePhoto = async () => {
        if (!device) return;
        setLoading(true);
        try {
            // Placeholder: implement frame processing or takeSnapshot with Frame Processor Plugin
            // This requires native setup and is skipped in this template
            setTimeout(() => {
                setImageUri('https://via.placeholder.com/300'); // Fake preview
                setShowResult(true);
                setLoading(false);
            }, 1000);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const retry = () => {
        setCurrentStep(0);
        setProgress(0);
        setImageUri(null);
        setShowResult(false);
    };

    if (!device || !hasPermission) {
        return (
            <View style={styles.centered}>
                <Text>Waiting for camera permission or device...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {!showResult ? (
                <>
                    <Camera
                        style={styles.camera}
                        device={device}
                        isActive={true}
                        photo={true}

                    />
                    <View style={styles.overlay}>
                        <View style={styles.circle} />
                        <AnimatedCircularProgress
                            size={CIRCLE_SIZE + 40}
                            width={5}
                            fill={progress}
                            tintColor={Colors.primary}
                            backgroundColor="#eee"
                            style={styles.progress}
                        />
                    </View>
                    <View style={styles.instructionContainer}>
                        {currentStep < instructions.length ? (
                            <Text style={styles.instruction}>{instructions[currentStep]}</Text>
                        ) : (
                            <Text style={styles.instruction}>📸 Capturing...</Text>
                        )}
                    </View>
                    {loading && <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 20 }} />}
                </>
            ) : (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>🎉 Liveness Successful</Text>
                    {imageUri && <Image source={{ uri: imageUri }} style={styles.resultImage} />}
                    <PrimaryButton label="Retry" onPress={retry} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: '100%',
        height: 450,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: CIRCLE_SIZE / 2,
        borderWidth: 4,
        borderColor: Colors.primary,
        position: 'absolute',
    },
    progress: {
        position: 'absolute',
    },
    instructionContainer: {
        padding: 20,
        alignItems: 'center',
    },
    instruction: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.primary,
    },
    resultContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    resultImage: {
        height: 300,
        width: 300,
        borderRadius: 12,
        marginVertical: 20,
        resizeMode: 'cover',
    },
    resultText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 20,
    },
});