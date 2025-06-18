import { TextInput, StyleSheet } from 'react-native';
import Colors from '../constants/Colors.ts';

export default function CNICInput({ value, onChange }: { value: string, onChange: (text: string) => void }) {
    return (
        <TextInput
            style={styles.input}
            placeholder="Enter your CNIC"
            keyboardType="numeric"
            value={value}
            onChangeText={onChange}
            maxLength={15}
            placeholderTextColor={Colors.text}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        color: Colors.text,
    },
});
