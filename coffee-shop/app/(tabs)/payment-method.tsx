import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const COLORS = {
  primary: '#D17842',
  secondary: '#252A32',
  background: '#0C0F14',
  card: '#141921',
  text: '#FFFFFF',
  textSecondary: '#52555A',
};

type PaymentOption = {
  id: string;
  name: string;
  displayName: string;
  color: string;
};

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: 'visa', name: 'Visa', displayName: 'VISA', color: '#1A1F71' },
  { id: 'mastercard', name: 'MasterCard', displayName: 'MasterCard', color: '#EB001B' },
  { id: 'apple_pay', name: 'Apple Pay', displayName: ' Pay', color: '#FFFFFF' },
  { id: 'google_pay', name: 'Google Pay', displayName: 'G Pay', color: '#4285F4' },
];

export default function PaymentMethodScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedMethod) {
      router.push('/card-information');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.sectionLabel}>Payment</Text>
        <TouchableOpacity style={styles.addCardBtn}>
          <Ionicons name="add-circle-outline" size={18} color={COLORS.textSecondary} />
          <Text style={styles.addCardText}>Add your card</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {PAYMENT_OPTIONS.map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
              onPress={() => setSelectedMethod(option.id)}
            >
              {option.id === 'visa' && (
                <Text style={[styles.logoText, { color: '#1A1F71', fontStyle: 'italic', fontWeight: '800' }]}>
                  VISA
                </Text>
              )}
              {option.id === 'mastercard' && (
                <View style={styles.mastercardLogo}>
                  <View style={[styles.mcCircle, { backgroundColor: '#EB001B' }]} />
                  <View style={[styles.mcCircle, { backgroundColor: '#F79E1B', marginLeft: -12 }]} />
                </View>
              )}
              {option.id === 'apple_pay' && (
                <Text style={[styles.logoText, { color: COLORS.text }]}>
                  <Ionicons name="logo-apple" size={22} color={COLORS.text} /> Pay
                </Text>
              )}
              {option.id === 'google_pay' && (
                <Text style={[styles.logoText]}>
                  <Text style={{ color: '#4285F4' }}>G</Text>
                  <Text style={{ color: '#EA4335' }}> </Text>
                  <Text style={{ color: '#5F6368' }}>Pay</Text>
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, !selectedMethod && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!selectedMethod}
        >
          <Text style={styles.continueBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionLabel: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  addCardBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  addCardText: { color: COLORS.textSecondary, fontSize: 13 },
  content: { padding: 20, paddingTop: 8, gap: 16 },
  paymentCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentCardSelected: {
    borderColor: COLORS.primary,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
  },
  mastercardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  footer: {
    padding: 20,
    paddingBottom: 34,
  },
  continueBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnDisabled: {
    opacity: 0.5,
  },
  continueBtnText: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
});
