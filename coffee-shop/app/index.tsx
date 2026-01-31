import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IntroImage from '../assets/images/coffee/intro.svg';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // fake loading time 3 seconds
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LinearGradient
      colors={['#F6EFE9', '#E3D2C4']} 
      style={styles.container}
    >
      <View style={styles.content}>
        <IntroImage width={150} height={150} />
        <Text style={styles.title}>CoffeeShop</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3C2318', 
    letterSpacing: 1,
  },
});
