import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors.ts';

export default function PrimaryButton({ label, onPress }: { label: string, onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        color: Colors.white,
        fontWeight: '600',
        fontSize: 16,
    },
});
