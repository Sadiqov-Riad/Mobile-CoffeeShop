import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  primary: '#D17842',
  secondary: '#252A32',
  background: '#0C0F14',
  text: '#FFFFFF',
  textSecondary: '#52555A',
};

export default function OrderConfirmationScreen() {
  const router = useRouter();

  const handleThankYou = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Confirmation</Text>

      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={80} color={COLORS.text} />
        </View>

        <Text style={styles.title}>Your order has been{'\n'}accepted</Text>
        <Text style={styles.subtitle}>
          Your order has been accepted.{'\n'}Your order has{'\n'}been accepted. Your order{'\n'}has been accepted
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={handleThankYou}>
          <Text style={styles.btnText}>Thank You</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerTitle: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 60,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  checkCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
});
