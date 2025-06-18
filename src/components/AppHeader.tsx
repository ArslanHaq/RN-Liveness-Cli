import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeft} from "lucide-react-native";

interface Props {
    title: string;
    showBack?: boolean;
}

export default function AppHeader({title, showBack = true}: Props) {
    const navigation = useNavigation();

    return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.overlay}>

                    <View style={{flexDirection: 'row', alignItems: 'center', width:'100%', backgroundColor: 'white', paddingHorizontal:10, paddingVertical: 10, borderRadius: 10}}>
                        {showBack && (
                            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                <ArrowLeft size={24} color="green" />
                            </TouchableOpacity>
                        )}
                        <Image
                            source={
                                require('../assets/images/logo.png')
                            }
                            style={{width: 40, height: 40, borderRadius: 15}}
                        />
                        <Text style={styles.title}>{title}</Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 100, // height increased to allow space for SafeArea
        justifyContent: 'flex-end',
        backgroundColor: '#000',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        color: 'black',
        fontSize: 20,
        marginLeft: 5,
        fontWeight: 'bold',
    }
});
