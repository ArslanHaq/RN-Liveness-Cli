import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import Colors from '../constants/Colors.ts';

export const toastConfig = {
    success: (props: any) => (
        <BaseToast
            {...props}
            style={[styles.toastContainer, { borderLeftColor: '#4BB543' }]}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={styles.text1}
            text2Style={styles.text2}
        />
    ),

    error: (props: any) => (
        <ErrorToast
            {...props}
            style={[styles.toastContainer, { borderLeftColor: '#ff5b5b' }]}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={styles.text1}
            text2Style={styles.text2}
        />
    ),
};

const styles = StyleSheet.create({
    toastContainer: {
        borderLeftWidth: 6,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
    },
    text1: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
    },
    text2: {
        fontSize: 14,
        color: '#666',
        marginTop: 3,
    },
});
