import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';


export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={{ alignItems: 'center', overflow: 'hidden' }}>

                <Image
                    source={require('../assets/images/coffee/coffee-cup.png')}
                    style={styles.imageWrapper}
                />

            </View>
            <View style={styles.contentContainer}>
                <View style={styles.textWrapper}>
                    <Text style={styles.title}>
                        Enjoy quality brew with the finest of flavours
                    </Text>
                    <Text style={styles.subtitle}>
                        The best gain, the finest roast, the powerful flavor.
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/signin')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E252D',
    },
    imageWrapper: {
        width: "120%",
        height: 320,
        marginTop: 200,
        marginLeft: 20,
        resizeMode: 'cover',
    },

    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
        gap: 40,
        justifyContent: 'space-between',
    },
    textWrapper: {
        gap: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#A0A0A0',
        textAlign: 'center',
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#8D5839',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#8D5839',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});
